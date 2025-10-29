// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmptyMessage = document.querySelector('.cart-empty');
    const cartCountElements = document.querySelectorAll('.cart-count, .cart-count-title');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const taxElement = document.querySelector('.tax');
    const discountElement = document.querySelector('.discount');
    const discountAmountElement = document.querySelector('.discount-amount');
    const totalAmountElement = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const clearCartBtn = document.querySelector('.clear-cart');
    const promoCodeInput = document.getElementById('promo-code-input');
    const applyPromoBtn = document.getElementById('apply-promo');
    const productsSlider = document.querySelector('.products-slider');
    
    // Cart template
    const cartItemTemplate = document.getElementById('cart-item-template');
    
    // Cart data
    let cart = [];
    let promoCode = '';
    const validPromoCodes = {
        'WELCOME10': 10,
        'SUMMER20': 20,
        'FLASH30': 30
    };
    
    // Shipping and tax rates
    const SHIPPING_RATE = 5.99;
    const TAX_RATE = 0.08; // 8%
    const FREE_SHIPPING_THRESHOLD = 50;
    
    // Initialize cart
    function initCart() {
        loadCart();
        renderCart();
        updateCartSummary();
        loadRecommendedProducts();
    }
    
    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('ekartCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('ekartCart', JSON.stringify(cart));
    }
    
    // Render cart items
    function renderCart() {
        // Clear cart items container
        cartItemsContainer.innerHTML = '';
        
        // Update cart count
        updateCartCount();
        
        // Show empty cart message if cart is empty
        if (cart.length === 0) {
            cartEmptyMessage.classList.remove('hidden');
            checkoutBtn.disabled = true;
            return;
        }
        
        // Hide empty cart message
        cartEmptyMessage.classList.add('hidden');
        checkoutBtn.disabled = false;
        
        // Render cart items
        cart.forEach(item => {
            const cartItemElement = document.importNode(cartItemTemplate.content, true);
            const cartItem = cartItemElement.querySelector('.cart-item');
            
            // Set item data
            cartItem.dataset.id = item.id;
            cartItemElement.querySelector('.item-image img').src = item.image;
            cartItemElement.querySelector('.item-name').textContent = item.name;
            
            // Set variants if available
            const colorElement = cartItemElement.querySelector('.item-color');
            const storageElement = cartItemElement.querySelector('.item-storage');
            
            if (item.color) {
                colorElement.textContent = `Color: ${item.color}`;
            } else {
                colorElement.remove();
            }
            
            if (item.storage) {
                storageElement.textContent = `Storage: ${item.storage}`;
            } else {
                storageElement.remove();
            }
            
            // Set price and quantity
            cartItemElement.querySelector('.item-price').textContent = `$${item.price.toFixed(2)}`;
            cartItemElement.querySelector('.quantity-input').value = item.quantity;
            
            // Calculate and set item total
            const itemTotal = item.price * item.quantity;
            cartItemElement.querySelector('.item-total').textContent = `$${itemTotal.toFixed(2)}`;
            
            // Add event listeners
            const quantityInput = cartItemElement.querySelector('.quantity-input');
            const decreaseBtn = cartItemElement.querySelector('.decrease');
            const increaseBtn = cartItemElement.querySelector('.increase');
            const removeBtn = cartItemElement.querySelector('.remove-item');
            
            // Quantity change event
            quantityInput.addEventListener('change', function() {
                updateItemQuantity(item.id, parseInt(this.value));
            });
            
            // Decrease quantity button
            decreaseBtn.addEventListener('click', function() {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    updateItemQuantity(item.id, parseInt(quantityInput.value));
                }
            });
            
            // Increase quantity button
            increaseBtn.addEventListener('click', function() {
                if (quantityInput.value < 10) {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                    updateItemQuantity(item.id, parseInt(quantityInput.value));
                }
            });
            
            // Remove item button
            removeBtn.addEventListener('click', function() {
                removeCartItem(item.id);
            });
            
            // Append cart item to container
            cartItemsContainer.appendChild(cartItemElement);
        });
    }
    
    // Update cart count
    function updateCartCount() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
    }
    
    // Update item quantity
    function updateItemQuantity(itemId, quantity) {
        // Find item in cart
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            // Update quantity
            cart[itemIndex].quantity = quantity;
            
            // Update item total
            const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
            const itemTotal = cart[itemIndex].price * quantity;
            itemElement.querySelector('.item-total').textContent = `$${itemTotal.toFixed(2)}`;
            
            // Save cart and update summary
            saveCart();
            updateCartSummary();
            updateCartCount();
        }
    }
    
    // Remove cart item
    function removeCartItem(itemId) {
        // Remove item from cart
        cart = cart.filter(item => item.id !== itemId);
        
        // Save cart and re-render
        saveCart();
        renderCart();
        updateCartSummary();
        
        // Show notification
        showNotification('Item removed from cart', 'error');
    }
    
    // Clear cart
    function clearCart() {
        // Clear cart array
        cart = [];
        
        // Save cart and re-render
        saveCart();
        renderCart();
        updateCartSummary();
        
        // Show notification
        showNotification('Cart cleared', 'error');
    }
    
    // Update cart summary
    function updateCartSummary() {
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Calculate shipping
        let shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
        
        // Calculate tax
        const tax = subtotal * TAX_RATE;
        
        // Calculate discount
        let discount = 0;
        if (promoCode && validPromoCodes[promoCode]) {
            discount = (subtotal * validPromoCodes[promoCode]) / 100;
            discountElement.classList.remove('hidden');
            discountAmountElement.textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountElement.classList.add('hidden');
        }
        
        // Calculate total
        const total = subtotal + shipping + tax - discount;
        
        // Update summary elements
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalAmountElement.textContent = `$${total.toFixed(2)}`;
        
        // Update checkout button
        checkoutBtn.disabled = cart.length === 0;
    }
    
    // Apply promo code
    function applyPromoCode() {
        const code = promoCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            showNotification('Please enter a promo code', 'error');
            return;
        }
        
        if (validPromoCodes[code]) {
            promoCode = code;
            updateCartSummary();
            showNotification(`Promo code ${code} applied! ${validPromoCodes[code]}% discount`, 'success');
        } else {
            showNotification('Invalid promo code', 'error');
        }
    }
    
    // Load recommended products
    function loadRecommendedProducts() {
        // Sample recommended products
        const recommendedProducts = [
            {
                id: 'rec1',
                name: 'Wireless Bluetooth Earbuds',
                price: 49.99,
                originalPrice: 79.99,
                image: 'https://via.placeholder.com/150',
                rating: 4.5,
                ratingCount: 128
            },
            {
                id: 'rec2',
                name: 'Smart Fitness Tracker Watch',
                price: 89.99,
                originalPrice: 119.99,
                image: 'https://via.placeholder.com/150',
                rating: 4.3,
                ratingCount: 95
            },
            {
                id: 'rec3',
                name: 'Portable Bluetooth Speaker',
                price: 39.99,
                originalPrice: 59.99,
                image: 'https://via.placeholder.com/150',
                rating: 4.7,
                ratingCount: 203
            },
            {
                id: 'rec4',
                name: 'Fast Wireless Charger',
                price: 29.99,
                originalPrice: 44.99,
                image: 'https://via.placeholder.com/150',
                rating: 4.2,
                ratingCount: 87
            }
        ];
        
        // Clear products slider
        productsSlider.innerHTML = '';
        
        // Render recommended products
        recommendedProducts.forEach(product => {
            const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                        <span class="discount-percent">${discountPercent}% off</span>
                    </div>
                    <div class="product-rating">
                        <div class="rating-stars">
                            ${getRatingStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.ratingCount})</span>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            `;
            
            // Add event listener to add to cart button
            const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', function() {
                addToCart(product);
            });
            
            // Append product card to slider
            productsSlider.appendChild(productCard);
        });
    }
    
    // Add to cart
    function addToCart(product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity if already in cart
            existingItem.quantity += 1;
            showNotification(`Increased ${product.name} quantity in cart`, 'success');
        } else {
            // Add new item to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            showNotification(`${product.name} added to cart`, 'success');
        }
        
        // Save cart and re-render
        saveCart();
        renderCart();
        updateCartSummary();
    }
    
    // Get rating stars HTML
    function getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
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
    
    // Event listeners
    clearCartBtn.addEventListener('click', clearCart);
    applyPromoBtn.addEventListener('click', applyPromoCode);
    checkoutBtn.addEventListener('click', function() {
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    });
    
    // Initialize cart
    initCart();
    
    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification.success i {
            color: #2ecc71;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
    `;
    document.head.appendChild(notificationStyles);
});