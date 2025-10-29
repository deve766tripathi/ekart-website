// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Event listeners for slider controls
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Load trending products
    loadTrendingProducts();

    // Load deals of the day
    loadDeals();

    // Countdown timer
    startCountdown();

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our newsletter soon.`);
            this.reset();
        });
    }
});

// Sample product data (in a real application, this would come from an API)
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        brand: "SoundMax",
        price: 129.99,
        originalPrice: 199.99,
        discount: "35% off",
        rating: 4.5,
        ratingCount: 1287,
        image: "images/headphones.jpg",
        category: "electronics"
    },
    {
        id: 2,
        name: "Slim Fit Men's Casual Shirt",
        brand: "FashionPlus",
        price: 34.99,
        originalPrice: 49.99,
        discount: "30% off",
        rating: 4.2,
        ratingCount: 856,
        image: "images/shirt.jpg",
        category: "fashion"
    },
    {
        id: 3,
        name: "Smart LED TV 55-inch 4K",
        brand: "VisionTech",
        price: 499.99,
        originalPrice: 699.99,
        discount: "28% off",
        rating: 4.7,
        ratingCount: 2341,
        image: "images/tv.jpg",
        category: "electronics"
    },
    {
        id: 4,
        name: "Ergonomic Office Chair",
        brand: "ComfortZone",
        price: 159.99,
        originalPrice: 249.99,
        discount: "36% off",
        rating: 4.4,
        ratingCount: 932,
        image: "images/chair.jpg",
        category: "home"
    },
    {
        id: 5,
        name: "Professional DSLR Camera",
        brand: "PixelPro",
        price: 899.99,
        originalPrice: 1199.99,
        discount: "25% off",
        rating: 4.8,
        ratingCount: 1543,
        image: "images/camera.jpg",
        category: "electronics"
    },
    {
        id: 6,
        name: "Stainless Steel Water Bottle",
        brand: "EcoLife",
        price: 24.99,
        originalPrice: 34.99,
        discount: "29% off",
        rating: 4.3,
        ratingCount: 765,
        image: "images/bottle.jpg",
        category: "home"
    },
    {
        id: 7,
        name: "Wireless Bluetooth Speaker",
        brand: "SoundMax",
        price: 79.99,
        originalPrice: 129.99,
        discount: "38% off",
        rating: 4.6,
        ratingCount: 1098,
        image: "images/speaker.jpg",
        category: "electronics"
    },
    {
        id: 8,
        name: "Running Shoes for Men",
        brand: "SportsFit",
        price: 89.99,
        originalPrice: 119.99,
        discount: "25% off",
        rating: 4.4,
        ratingCount: 876,
        image: "images/shoes.jpg",
        category: "fashion"
    }
];

// Function to load trending products
function loadTrendingProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    // Clear existing content
    productGrid.innerHTML = '';

    // Display first 4 products
    products.slice(0, 4).forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Function to create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-wishlist">
                <i class="far fa-heart"></i>
            </div>
        </div>
        <div class="product-details">
            <div class="product-brand">${product.brand}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">$${product.price}</span>
                <span class="original-price">$${product.originalPrice}</span>
                <span class="discount">${product.discount}</span>
            </div>
            <div class="product-rating">
                <div class="rating-stars">
                    ${product.rating} <i class="fas fa-star"></i>
                </div>
                <div class="rating-count">(${product.ratingCount})</div>
            </div>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;

    // Add event listener to wishlist icon
    const wishlistIcon = card.querySelector('.product-wishlist i');
    wishlistIcon.addEventListener('click', function() {
        this.classList.toggle('far');
        this.classList.toggle('fas');
        this.classList.toggle('text-danger');
    });

    // Add event listener to add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCart(product);
    });

    return card;
}

// Function to load deals
function loadDeals() {
    const dealsGrid = document.querySelector('.deals-grid');
    if (!dealsGrid) return;

    // Clear existing content
    dealsGrid.innerHTML = '';

    // Display last 4 products as deals
    products.slice(4, 8).forEach(product => {
        const dealCard = createProductCard(product);
        dealsGrid.appendChild(dealCard);
    });
}

// Function to start countdown
function startCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;

    let hours = parseInt(hoursElement.textContent);
    let minutes = parseInt(minutesElement.textContent);
    let seconds = parseInt(secondsElement.textContent);

    const countdownInterval = setInterval(function() {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    clearInterval(countdownInterval);
                    // Reset countdown or take action when countdown ends
                    hours = 10;
                    minutes = 0;
                    seconds = 0;
                }
            }
        }
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Cart functionality
let cart = [];

function addToCart(product) {
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
    
    // Update cart count
    updateCartCount();
}

function updateCartCount() {
    const cartLink = document.querySelector('.nav-link[href="cart.html"]');
    if (!cartLink) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart icon with count
    if (totalItems > 0) {
        cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${totalItems})`;
    } else {
        cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart`;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load cart from localStorage on page load
window.addEventListener('load', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});