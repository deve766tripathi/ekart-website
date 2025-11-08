document.addEventListener('DOMContentLoaded', function() {
    // --- Sample Data (Assuming 'products' from app.js is not loaded first) ---
    // In a real app, 'products' would be loaded from app.js or an API
    const allProducts = [
        { id: 1, name: "Premium Wireless Headphones", brand: "SoundMax", price: 129.99, originalPrice: 199.99, discount: 35, rating: 4.5, ratingCount: 1287, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format", category: "electronics" },
        { id: 2, name: "Slim Fit Men's Casual Shirt", brand: "FashionPlus", price: 34.99, originalPrice: 49.99, discount: 30, rating: 4.2, ratingCount: 856, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format", category: "fashion" },
        { id: 3, name: "Smart LED TV 55-inch 4K", brand: "VisionTech", price: 499.99, originalPrice: 699.99, discount: 28, rating: 4.7, ratingCount: 2341, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format", category: "electronics" },
        { id: 4, name: "Ergonomic Office Chair", brand: "ComfortZone", price: 159.99, originalPrice: 249.99, discount: 36, rating: 4.4, ratingCount: 932, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&auto=format", category: "home" },
        { id: 5, name: "Professional DSLR Camera", brand: "PixelPro", price: 899.99, originalPrice: 1199.99, discount: 25, rating: 4.8, ratingCount: 1543, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&auto=format", category: "electronics" },
        { id: 6, name: "Stainless Steel Water Bottle", brand: "EcoLife", price: 24.99, originalPrice: 34.99, discount: 29, rating: 4.3, ratingCount: 765, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&auto=format", category: "home" },
        { id: 7, name: "Wireless Bluetooth Speaker", brand: "SoundMax", price: 79.99, originalPrice: 129.99, discount: 38, rating: 4.6, ratingCount: 1098, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format", category: "electronics" },
        { id: 8, name: "Running Shoes for Men", brand: "SportsFit", price: 89.99, originalPrice: 119.99, discount: 25, rating: 4.4, ratingCount: 876, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format", category: "fashion" },
        { id: 9, name: "Modern Coffee Maker", brand: "HomeBrew", price: 69.99, originalPrice: 99.99, discount: 30, rating: 4.1, ratingCount: 543, image: "https://images.unsplash.com/photo-1517668808824-b7a0bcc81f57?w=400&h=400&fit=crop&auto=format", category: "appliances" },
        { id: 10, name: "Organic Face Cream", brand: "PureGlow", price: 29.99, originalPrice: 39.99, discount: 25, rating: 4.9, ratingCount: 1500, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop&auto=format", category: "beauty" },
        { id: 11, name: "Building Blocks Set", brand: "KidzJoy", price: 49.99, originalPrice: 69.99, discount: 28, rating: 4.7, ratingCount: 750, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format", category: "toys" },
        { id: 12, name: "Smartphone 12 Pro", brand: "TechCore", price: 799.99, originalPrice: 999.99, discount: 20, rating: 4.6, ratingCount: 3200, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format", category: "electronics" },
    ];

    // --- DOM Elements ---
    const productsGrid = document.getElementById('products-grid');
    const categoryTitle = document.getElementById('category-title');
    const sortSelect = document.getElementById('sort-select');
    const filterSidebar = document.querySelector('.filters-sidebar');
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.filter-options input[type="radio"]');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyPriceBtn = document.getElementById('apply-price');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const activeFiltersContainer = document.getElementById('active-filters');
    const paginationContainer = document.getElementById('page-numbers');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    // --- State ---
    let currentPage = 1;
    const productsPerPage = 9;
    let currentFilters = {
        categories: [],
        minPrice: null,
        maxPrice: null,
        rating: null,
        discount: null,
        availability: []
    };
    let currentSort = 'popularity';

    // --- Initialization ---
    function init() {
        handleURLParams();
        renderProducts();
        setupEventListeners();
        updateActiveFiltersDisplay();
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Sort
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });

        // Filters
        filterCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
        filterRadios.forEach(radio => radio.addEventListener('change', applyFilters));
        applyPriceBtn.addEventListener('click', applyFilters);
        clearFiltersBtn.addEventListener('click', clearAllFilters);

        // Pagination
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            // This logic will be firmed up in renderPagination
            currentPage++;
            renderProducts();
        });
    }

    // --- URL Handling ---
    function handleURLParams() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category) {
            currentFilters.categories.push(category);
            // Check the corresponding checkbox
            const cb = document.querySelector(`.filter-options input[value="${category}"]`);
            if (cb) cb.checked = true;
            // Update title
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        }
    }

    // --- Filtering Logic ---
    function applyFilters() {
        // Get categories
        currentFilters.categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);

        // Get price
        currentFilters.minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : null;
        currentFilters.maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : null;

        // Get rating
        const ratingRadio = document.querySelector('input[name="rating"]:checked');
        currentFilters.rating = ratingRadio ? parseFloat(ratingRadio.value) : null;

        // Get discount
        const discountRadio = document.querySelector('input[name="discount"]:checked');
        currentFilters.discount = discountRadio ? parseFloat(discountRadio.value) : null;

        // Get availability
        currentFilters.availability = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(cb => cb.value);
        
        currentPage = 1; // Reset to first page
        renderProducts();
        updateActiveFiltersDisplay();
    }

    function clearAllFilters() {
        filterCheckboxes.forEach(cb => cb.checked = false);
        filterRadios.forEach(radio => radio.checked = false);
        minPriceInput.value = '';
        maxPriceInput.value = '';

        currentFilters = {
            categories: [],
            minPrice: null,
            maxPrice: null,
            rating: null,
            discount: null,
            availability: []
        };
        
        currentPage = 1;
        renderProducts();
        updateActiveFiltersDisplay();
    }

    // --- Active Filters UI ---
    function updateActiveFiltersDisplay() {
        activeFiltersContainer.innerHTML = '';
        
        // Add other filters as tags...
        Object.keys(currentFilters).forEach(key => {
            const value = currentFilters[key];
            if (value) {
                if (Array.isArray(value) && value.length > 0) {
                    value.forEach(v => addFilterTag(v, key, v));
                } else if (!Array.isArray(value)) {
                    if (key === 'minPrice') addFilterTag(`Min: $${value}`, key, value);
                    else if (key === 'maxPrice') addFilterTag(`Max: $${value}`, key, value);
                    else if (key === 'rating') addFilterTag(`${value}★ & above`, key, value);
                    else if (key === 'discount') addFilterTag(`${value}% & above`, key, value);
                }
            }
        });
    }

    function addFilterTag(text, key, value) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            ${text}
            <i class="fas fa-times" data-key="${key}" data-value="${value}"></i>
        `;
        tag.querySelector('i').addEventListener('click', removeFilter);
        activeFiltersContainer.appendChild(tag);
    }

    function removeFilter(e) {
        const { key, value } = e.target.dataset;

        if (Array.isArray(currentFilters[key])) {
            currentFilters[key] = currentFilters[key].filter(v => v !== value);
            const cb = document.querySelector(`input[value="${value}"]`);
            if (cb) cb.checked = false;
        } else {
            currentFilters[key] = null;
            if (key === 'minPrice') minPriceInput.value = '';
            else if (key === 'maxPrice') maxPriceInput.value = '';
            else {
                const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = false;
            }
        }
        
        applyFilters();
    }

    // --- Product Rendering ---
    function renderProducts() {
        productsGrid.innerHTML = ''; // Clear grid

        // 1. Filter
        let filteredProducts = allProducts.filter(product => {
            const { categories, minPrice, maxPrice, rating, discount, availability } = currentFilters;
            
            if (categories.length > 0 && !categories.includes(product.category)) return false;
            if (minPrice !== null && product.price < minPrice) return false;
            if (maxPrice !== null && product.price > maxPrice) return false;
            if (rating !== null && product.rating < rating) return false;
            if (discount !== null && product.discount < discount) return false;
            // Note: Availability logic not implemented as product data doesn't have it
            
            return true;
        });

        // 2. Sort
        filteredProducts.sort((a, b) => {
            switch (currentSort) {
                case 'price_low': return a.price - b.price;
                case 'price_high': return b.price - a.price;
                case 'rating': return b.rating - a.rating;
                case 'newest': return b.id - a.id; // Assuming higher ID is newer
                case 'popularity':
                default:
                    return b.ratingCount - a.ratingCount;
            }
        });

        // 3. Paginate
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // 4. Render
        if (paginatedProducts.length === 0) {
            productsGrid.innerHTML = '<p>No products found matching your criteria.</p>';
        } else {
            paginatedProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }

        // 5. Render Pagination
        renderPagination(totalPages);
    }

    function createProductCard(product) {
        // This function should be identical or similar to the one in app.js
        // If app.js is loaded first, this can be removed to avoid duplication
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="product-wishlist">
                    <i class="far fa-heart"></i>
                </div>
            </div>
            <div class="product-details">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discount">${product.discount}% off</span>
                </div>
                <div class="product-rating">
                    <div class="rating-stars">
                        ${product.rating} <i class="fas fa-star"></i>
                    </div>
                    <div class="rating-count">(${product.ratingCount})</div>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // Add to cart functionality (requires cart logic, possibly from app.js)
        card.querySelector('.add-to-cart').addEventListener('click', () => {
            // Assuming 'addToCart' function is globally available from app.js
            if (typeof addToCart === 'function') {
                addToCart(product);
            } else {
                console.warn('addToCart function not found. Please ensure app.js is loaded.');
            }
        });

        return card;
    }

    // --- Pagination Rendering ---
    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        
        // Prev/Next buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number';
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
            });
            paginationContainer.appendChild(pageBtn);
        }
    }

    // --- Start ---
    init();
});