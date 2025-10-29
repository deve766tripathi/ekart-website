// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const colorOptions = document.querySelectorAll('.color-option');
    const storageOptions = document.querySelectorAll('.storage-option');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pincodeInput = document.getElementById('pincode-input');
    const checkPincodeBtn = document.getElementById('check-pincode');
    const imageZoomOverlay = document.querySelector('.image-zoom-overlay');
    const categoryBreadcrumb = document.getElementById('category-breadcrumb');
    const productBreadcrumb = document.getElementById('product-breadcrumb');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Initialize page
    initPage();
    
    function initPage() {
        // If product ID is provided, load product details
        if (productId) {
            loadProductDetails(productId);
        }
        
        // Set up event listeners
        setupEventListeners();
    }
    
    function loadProductDetails(id) {
        // In a real app, you would fetch product details from an API
        // For this demo, we'll use the products array from app.js
        
        if (typeof products !== 'undefined') {
            const product = products.find(p => p.id == id);
            
            if (product) {
                // Update product details
                document.querySelector('.product-title').textContent = product.name;
                document.querySelector('.product-brand').innerHTML = `By <a href="#">${product.brand}</a>`;
                document.querySelector('.current-price').textContent = `$${product.price}`;
                document.querySelector('.original-price').textContent = `$${product.originalPrice}`;
                
                // Calculate discount percentage
                const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                document.querySelector('.discount').textContent = `${discountPercentage}% off`;
                
                // Update rating
                const ratingValue = document.querySelector('.rating-value');
                if (ratingValue) {
                    ratingValue.textContent = product.rating;
                }
                
                // Update stars
                updateStars(product.rating);
                
                // Update reviews count
                const reviewsCount = document.querySelector('.reviews-count a');
                if (reviewsCount) {
                    reviewsCount.textContent = `${product.ratingCount} Ratings & Reviews`;
                }
                
                // Update main image
                if (mainImage && product.image) {
                    mainImage.src = product.image;
                    
                    // Update thumbnails with the same image for demo
                    thumbnails.forEach(thumbnail => {
                        const img = thumbnail.querySelector('img');
                        if (img) {
                            img.src = product.image;
                        }
                    });
                }
                
                // Update breadcrumb
                if (categoryBreadcrumb && product.category) {
                    categoryBreadcrumb.textContent = getCategoryDisplayName(product.category);
                    categoryBreadcrumb.href = `products.html?category=${product.category}`;
                }
                
                if (productBreadcrumb) {
                    productBreadcrumb.textContent = product.name;
                }
            }
        }
    }
    
    function setupEventListeners() {
        // Thumbnail click event
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                const imageSrc = this.getAttribute('data-image');
                if (mainImage && imageSrc) {
                    mainImage.src = imageSrc;
                }
            });
        });
        
        // Color option click event
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all color options
                colorOptions.forEach(o => o.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // You could update product images based on color here
                const color = this.getAttribute('data-color');
                console.log(`Selected color: ${color}`);
            });
        });
        
        // Storage option click event
        storageOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all storage options
                storageOptions.forEach(o => o.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // You could update price based on storage here
                const storage = this.getAttribute('data-storage');
                console.log(`Selected storage: ${storage}`);
            });
        });
        
        // Tab click event
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and tab panes
                tabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding tab pane
                this.classList.add('active');
                tabPanes[index].classList.add('active');
            });
        });
        
        // Check pincode event
        if (checkPincodeBtn) {
            checkPincodeBtn.addEventListener('click', function() {
                const pincode = pincodeInput.value.trim();
                if (pincode) {
                    // In a real app, you would check delivery availability for the pincode
                    // For this demo, we'll just show a success message
                    const deliveryInfo = document.querySelector('.delivery-info');
                    if (deliveryInfo) {
                        deliveryInfo.innerHTML = `
                            <i class="fas fa-truck"></i>
                            <span>Free delivery by <strong>Tomorrow</strong> for pincode ${pincode}</span>
                        `;
                    }
                }
            });
        }
        
        // Image zoom event
        if (imageZoomOverlay) {
            imageZoomOverlay.addEventListener('click', function() {
                // In a real app, you would show a zoomed image or lightbox
                // For this demo, we'll just log a message
                console.log('Image zoom clicked');
            });
        }
        
        // Add to cart event
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                addToCart();
            });
        }
        
        // Buy now event
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                addToCart();
                // Redirect to cart page
                window.location.href = 'cart.html';
            });
        }
    }
    
    function addToCart() {
        if (!productId) return;
        
        // Get selected options
        const selectedColor = document.querySelector('.color-option.active')?.getAttribute('data-color') || '';
        const selectedStorage = document.querySelector('.storage-option.active')?.getAttribute('data-storage') || '';
        
        // Find product in products array
        if (typeof products !== 'undefined') {
            const product = products.find(p => p.id == productId);
            
            if (product) {
                // Create cart item
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: selectedColor,
                    storage: selectedStorage,
                    quantity: 1
                };
                
                // Get existing cart from localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Check if product already exists in cart
                const existingItemIndex = cart.findIndex(item => 
                    item.id == cartItem.id && 
                    item.color === cartItem.color && 
                    item.storage === cartItem.storage
                );
                
                if (existingItemIndex !== -1) {
                    // Update quantity if product already exists
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add new item to cart
                    cart.push(cartItem);
                }
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart count
                updateCartCount();
                
                // Show success message
                showNotification('Product added to cart!');
            }
        }
    }
    
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add notification to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    function updateStars(rating) {
        const starsElements = document.querySelectorAll('.product-rating .stars i');
        
        if (starsElements.length > 0) {
            // Reset all stars
            starsElements.forEach((star, index) => {
                if (index < Math.floor(rating)) {
                    // Full star
                    star.className = 'fas fa-star';
                } else if (index < Math.ceil(rating) && rating % 1 !== 0) {
                    // Half star
                    star.className = 'fas fa-star-half-alt';
                } else {
                    // Empty star
                    star.className = 'far fa-star';
                }
            });
        }
    }
    
    function getCategoryDisplayName(category) {
        const categoryMap = {
            'electronics': 'Electronics',
            'fashion': 'Fashion',
            'home': 'Home & Furniture',
            'appliances': 'Appliances',
            'beauty': 'Beauty & Personal Care',
            'toys': 'Toys & Baby'
        };
        
        return categoryMap[category] || category;
    }
    
    // Initialize cart count on page load
    updateCartCount();
});