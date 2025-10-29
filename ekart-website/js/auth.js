// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });
    
    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Password strength meter
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = `${strength.score * 25}%`;
            strengthBar.style.background = strength.color;
            
            // Update strength text
            strengthText.textContent = strength.text;
            strengthText.style.color = strength.color;
        });
    }
    
    // Calculate password strength
    function calculatePasswordStrength(password) {
        let score = 0;
        let color = '#ddd';
        let text = 'Password strength';
        
        if (password.length === 0) {
            return { score, color, text };
        }
        
        // Length check
        if (password.length > 5) score++;
        if (password.length > 8) score++;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Determine strength text and color
        if (score <= 1) {
            text = 'Weak';
            color = '#e74c3c';
        } else if (score <= 3) {
            text = 'Medium';
            color = '#f39c12';
        } else {
            text = 'Strong';
            color = '#2ecc71';
        }
        
        return { score, color, text };
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validate form
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate login (in a real app, this would be an API call)
            simulateLogin(email, password, rememberMe);
        });
    }
    
    // Sign up form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validate form
            if (!name || !email || !phone || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!termsAccepted) {
                showNotification('Please accept the terms and conditions', 'error');
                return;
            }
            
            // Simulate signup (in a real app, this would be an API call)
            simulateSignup(name, email, phone, password);
        });
    }
    
    // Simulate login
    function simulateLogin(email, password, rememberMe) {
        // Show loading state
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            hideLoading();
            
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('ekartUsers') || '[]');
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Set current user
                localStorage.setItem('ekartCurrentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }));
                
                // Show success notification
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to profile page
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                showNotification('Invalid email or password', 'error');
            }
        }, 1500);
    }
    
    // Simulate signup
    function simulateSignup(name, email, phone, password) {
        // Show loading state
        showLoading();
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            hideLoading();
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('ekartUsers') || '[]');
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                showNotification('User with this email already exists', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                phone,
                password,
                createdAt: new Date().toISOString()
            };
            
            // Add user to localStorage
            users.push(newUser);
            localStorage.setItem('ekartUsers', JSON.stringify(users));
            
            // Set current user
            localStorage.setItem('ekartCurrentUser', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone
            }));
            
            // Show success notification
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Redirect to profile page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        }, 1500);
    }
    
    // Show loading state
    function showLoading() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        
        document.body.appendChild(loadingOverlay);
        document.body.classList.add('loading');
    }
    
    // Hide loading state
    function hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
            document.body.classList.remove('loading');
        }
    }
    
    // Show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add notification to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        body.loading {
            overflow: hidden;
        }
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loadingStyles);
    
    // Check if user is logged in
    function checkLoggedInUser() {
        const currentUser = localStorage.getItem('ekartCurrentUser');
        
        if (currentUser) {
            // Update header
            const loginLink = document.querySelector('.header-actions .action-link:first-child');
            if (loginLink) {
                const user = JSON.parse(currentUser);
                loginLink.href = 'profile.html';
                loginLink.querySelector('span').textContent = user.name.split(' ')[0];
            }
        }
    }
    
    // Initialize
    checkLoggedInUser();
});