pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'
        DOCKERHUB_USERNAME = 'devesh1384'
        AWS_REGION = 'ap-south-1'
        EKS_CLUSTER_NAME = 'poll-app-cluster'
        AWS_CREDENTIALS_ID = 'aws-creds' // The AWS credentials you created in Jenkins
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/ekart-website"
    }

    stages {
        stage('Checkout') {
            steps {
                // Get the code from the Git repository
                git branch: 'main',url: 'https://github.com/deve766tripathi/ekart-website.git'
            }
        }
    stage('Configure Server with Ansible') {
    steps {
        // Run the ansible playbook we just created
        sh 'ansible-playbook ansible/install_agent.yml'
    }
}

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image and tag it with the build number
                    sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                // Use the credentials stored in Jenkins to log in
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                // This stage was missing
                sh "docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Deploy to EKS') {
            steps {
                // This wrapper is CRITICAL. It uses your 'aws-creds' to authenticate.
                withCredentials([aws(credentialsId: AWS_CREDENTIALS_ID, region: AWS_REGION)]) {
                    script {
                        // Update kubeconfig to connect to our EKS cluster
                        sh "aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}"
                        
                        // Apply the deployment and service files
                        sh "kubectl apply -f deployment.yaml"
                        sh "kubectl apply -f service.yaml"

                        // This is the most important command.
                        // It tells Kubernetes to update the deployment with the new image.
                        sh "kubectl set image deployment/ekart-website-deployment ekart-container=${IMAGE_NAME}:${BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up by logging out of Docker Hub
            sh 'docker logout'
        }
    }
}
