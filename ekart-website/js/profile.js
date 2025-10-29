document.addEventListener('DOMContentLoaded', function() {
    
    // --- DOM Elements ---
    const menuItems = document.querySelectorAll('.profile-menu li');
    const tabs = document.querySelectorAll('.profile-tab');
    const logoutBtn = document.getElementById('logout-btn');

    // Profile Form
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const profileFormActions = document.getElementById('profile-form-actions');
    const cancelProfileBtn = document.getElementById('cancel-profile-btn');
    const profileInputs = profileForm.querySelectorAll('input, select');
    
    // User Info Elements
    const headerUserName = document.querySelector('.header-user-name');
    const profileUserName = document.getElementById('profile-user-name');
    const profileUserEmail = document.getElementById('profile-user-email');
    const profileFullNameInput = document.getElementById('profile-full-name');
    const profileEmailInput = document.getElementById('profile-email');
    const profilePhoneInput = document.getElementById('profile-phone');


    // --- Initialization ---
    function init() {
        loadUserInfo();
        setupEventListeners();
    }

    // --- Load User Info ---
    function loadUserInfo() {
        const currentUser = JSON.parse(localStorage.getItem('ekartCurrentUser'));
        
        if (currentUser) {
            // Update header
            if (headerUserName) {
                headerUserName.textContent = currentUser.name.split(' ')[0];
            }
            // Update profile sidebar
            if (profileUserName) {
                profileUserName.textContent = `Hello, ${currentUser.name}`;
            }
            if (profileUserEmail) {
                profileUserEmail.textContent = currentUser.email;
            }
            // Update profile form fields
            if (profileFullNameInput) {
                profileFullNameInput.value = currentUser.name;
            }
            if (profileEmailInput) {
                profileEmailInput.value = currentUser.email;
            }
            if (profilePhoneInput) {
                profilePhoneInput.value = currentUser.phone || '';
            }
        } else {
            // No user logged in, redirect to login
            // window.location.href = 'login.html';
            console.warn('No user logged in.');
        }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Tab Switching
        menuItems.forEach(item => {
            if (item.id !== 'logout-btn') {
                item.addEventListener('click', () => {
                    // Remove active class from all menu items
                    menuItems.forEach(i => i.classList.remove('active'));
                    // Add active class to clicked item
                    item.classList.add('active');
                    
                    // Hide all tabs
                    tabs.forEach(tab => tab.classList.remove('active'));
                    // Show target tab
                    const tabId = item.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            }
        });

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('ekartCurrentUser');
                // You might also want to clear the cart or other user data
                // localStorage.removeItem('ekartCart');
                window.location.href = 'index.html';
            });
        }

        // Edit Profile
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                toggleProfileForm(true);
            });
        }

        // Cancel Edit Profile
        if (cancelProfileBtn) {
            cancelProfileBtn.addEventListener('click', () => {
                toggleProfileForm(false);
                // Reset form fields to original values (or re-load from localStorage)
                loadUserInfo(); 
            });
        }
        
        // Save Profile Form
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // --- In a real app, send this data to a server ---
                
                // 1. Get data from form
                const updatedName = profileFullNameInput.value;
                const updatedEmail = profileEmailInput.value;
                const updatedPhone = profilePhoneInput.value;
                
                // 2. Update localStorage
                let currentUser = JSON.parse(localStorage.getItem('ekartCurrentUser'));
                let allUsers = JSON.parse(localStorage.getItem('ekartUsers') || '[]');
                
                if (currentUser) {
                    // Update current user session
                    currentUser.name = updatedName;
                    currentUser.email = updatedEmail;
                    currentUser.phone = updatedPhone;
                    localStorage.setItem('ekartCurrentUser', JSON.stringify(currentUser));
                    
                    // Find and update user in the "database"
                    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
                    if (userIndex > -1) {
                        allUsers[userIndex].name = updatedName;
                        allUsers[userIndex].email = updatedEmail;
                        allUsers[userIndex].phone = updatedPhone;
                        localStorage.setItem('ekartUsers', JSON.stringify(allUsers));
                    }
                }
                
                // 3. Update UI
                loadUserInfo();
                toggleProfileForm(false);
                
                // Show success notification (if you have one)
                console.log('Profile updated!');
            });
        }
    }

    // --- Helper Functions ---
    function toggleProfileForm(isEditing) {
        if (isEditing) {
            // Enable editing
            editProfileBtn.classList.add('hidden');
            profileFormActions.classList.remove('hidden');
            profileInputs.forEach(input => input.disabled = false);
            // Don't allow email editing
            profileEmailInput.disabled = true; 
        } else {
            // Disable editing
            editProfileBtn.classList.remove('hidden');
            profileFormActions.classList.add('hidden');
            profileInputs.forEach(input => input.disabled = true);
        }
    }
    
    // --- Start ---
    init();

});