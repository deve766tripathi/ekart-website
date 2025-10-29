pipeline {
    agent any

    environment {
        // Define credentials ID for Docker Hub. We will create this in Jenkins UI.
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-creds'
        // Define your Docker Hub username
        DOCKERHUB_USERNAME = 'your-dockerhub-username' // <-- IMPORTANT: Change this!
        AWS_REGION = 'ap-south-1'
        EKS_CLUSTER_NAME = 'poll-app-cluster'
    }

    stages {
        stage('Checkout') {
            steps {
                // Get the code from the Git repository
                git 'https://github.com/your-github-username/poll-app.git' // <-- IMPORTANT: Change this!
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image and tag it with the build number
                    sh "docker build -t ${DOCKERHUB_USERNAME}/poll-app:${BUILD_NUMBER} ."
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
                // Push the newly built image to Docker Hub
                sh "docker push ${DOCKERHUB_USERNAME}/poll-app:${BUILD_NUMBER}"
            }
        }

        stage('Deploy to EKS') {
            steps {
                script {
                    // Update kubeconfig to connect to our EKS cluster
                    sh "aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}"
                    
                    // We will create these Kubernetes files in the next step
                    // This command applies the configuration to the cluster,
                    // telling it to use the new image we just pushed.
                    sh "kubectl apply -f deployment.yaml"
                    sh "kubectl apply -f service.yaml"
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
