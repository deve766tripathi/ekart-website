document.addEventListener('DOMContentLoaded', function() {
    
    // --- DOM Elements ---
    const summaryList = document.getElementById('summary-items-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');
    const placeOrderTotal = document.querySelector('.place-order-total');
    const checkoutForm = document.getElementById('checkout-form');
    const successModal = document.getElementById('success-modal');
    const orderIdSpan = document.getElementById('order-id');
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    const cardDetailsForm = document.getElementById('card-details-form');
    const cardInputs = cardDetailsForm.querySelectorAll('input');

    // --- Rates ---
    const TAX_RATE = 0.08; // 8%
    const SHIPPING_RATE = 5.99;
    const FREE_SHIPPING_THRESHOLD = 50;

    let cart = [];

    // --- Initialization ---
    function init() {
        loadCart();
        renderSummary();
        setupEventListeners();
    }

    // --- Cart Logic ---
    function loadCart() {
        // Using 'ekartCart' as defined in your cart.js
        const savedCart = localStorage.getItem('ekartCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        } else {
            // No items in cart, redirect
            summaryList.innerHTML = '<p>Your cart is empty. Redirecting...</p>';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    // --- Render Logic ---
    function renderSummary() {
        summaryList.innerHTML = '';
        if (cart.length === 0) {
            summaryList.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <div class="summary-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="summary-item-details">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            summaryList.appendChild(itemElement);
        });

        // Calculate totals
        const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
        const tax = subtotal * TAX_RATE;
        const total = subtotal + shipping + tax;

        // Update UI
        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        summaryTax.textContent = `$${tax.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
        placeOrderTotal.textContent = `$${total.toFixed(2)}`;
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Payment Method Toggle
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'card') {
                    cardDetailsForm.style.display = 'block';
                    cardInputs.forEach(input => input.required = true);
                } else {
                    cardDetailsForm.style.display = 'none';
                    cardInputs.forEach(input => input.required = false);
                }
            });
        });

        // Form Submission
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // --- In a real app, you would process payment here ---
            
            // Show success
            showSuccessModal();

            // Clear the cart
            localStorage.removeItem('ekartCart');
        });
    }

    // --- Helper Functions ---
    function showSuccessModal() {
        // Generate a random order ID
        const randomOrderId = Math.floor(100000 + Math.random() * 900000);
        orderIdSpan.textContent = `#${randomOrderId}`;
        successModal.classList.remove('hidden');
    }

    // --- Start ---
    init();
});