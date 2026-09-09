document.addEventListener('DOMContentLoaded', () => {
    if (typeof products === 'undefined') {
        console.error("CRITICAL: products.js is not loaded. Please check your script tags in product.html.");
        alert("Database missing! Please add products.js to your HTML.");
        return;
    }

    const titleEl = document.querySelector('#product-title');
    if (!titleEl) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.querySelector('.product__container').innerHTML = `
            <div class="not-found">
                <h2 class="not-found__title">Product Not Found</h2>
                <p class="not-found__message">Sorry, this item doesn't exist or has been removed.</p>
                <a href="index.html" class="not-found__btn">Return to Shop</a>
            </div>
        `;
        return;
    }

    document.querySelector('#breadcrumb-title').textContent = product.name;
    titleEl.textContent = product.name;
    
    const mainImg = document.querySelector('#main-product-image');
    if (mainImg) {
        mainImg.src = product.image;
        mainImg.alt = product.name;
    }
    
    const thumb1 = document.querySelector('#thumbnail-1');
    const thumb2 = document.querySelector('#thumbnail-2');
    const thumb3 = document.querySelector('#thumbnail-3');
    if (thumb1) thumb1.src = product.image;
    if (thumb2) thumb2.src = product.image; 
    if (thumb3) thumb3.src = product.image; 
    
    const ratingValue = typeof product.rating === 'number' ? product.rating.toFixed(1) : '4.5';
    document.querySelector('#product-rating').textContent = `${ratingValue}/5`;
    
    document.querySelector('#product-current-price').textContent = `$${product.price}`;
    
    const oldPriceEl = document.querySelector('#product-old-price');
    const discountEl = document.querySelector('#product-discount');
    
    if (product.originalPrice) {
        oldPriceEl.textContent = `$${product.originalPrice}`;
        oldPriceEl.style.display = 'inline-block';
        oldPriceEl.classList.remove('is-hidden');
        
        const badgeText = product.discountBadge || `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`;
        discountEl.textContent = badgeText;
        discountEl.style.display = 'inline-block';
        discountEl.classList.remove('is-hidden');
    } else {
        oldPriceEl.textContent = '';
        oldPriceEl.style.display = 'none';
        oldPriceEl.classList.add('is-hidden');
        
        discountEl.textContent = '';
        discountEl.style.display = 'none';
        discountEl.classList.add('is-hidden');
    }

    document.querySelector('#product-description').textContent = product.description;

    let selectedColor = 'Olive Green'; 
    let selectedSize = 'Large'; 

    const colorBtns = document.querySelectorAll('.product__color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            colorBtns.forEach(b => b.classList.remove('product__color-btn--active'));
            e.target.classList.add('product__color-btn--active');
            selectedColor = e.target.getAttribute('aria-label');
        });
    });

    const sizeBtns = document.querySelectorAll('.product__size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('product__size-btn--active'));
            e.target.classList.add('product__size-btn--active');
            selectedSize = e.target.textContent.trim();
        });
    });

    const decreaseBtn = document.querySelector('#decrease-qty');
    const increaseBtn = document.querySelector('#increase-qty');
    const qtyInput = document.querySelector('#product-qty');

    if (decreaseBtn && increaseBtn && qtyInput) {
        decreaseBtn.addEventListener('click', () => {
            let currentVal = parseInt(qtyInput.value) || 1;
            if (currentVal > 1) {
                qtyInput.value = currentVal - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            let currentVal = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentVal + 1;
        });

        qtyInput.addEventListener('change', () => {
            if (parseInt(qtyInput.value) < 1 || isNaN(qtyInput.value)) {
                qtyInput.value = 1;
            }
        });
    }

    const addToCartBtn = document.querySelector('#add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(qtyInput.value) || 1;
            let cart = JSON.parse(localStorage.getItem('shopCart')) || [];
            
            const existingItemIndex = cart.findIndex(item => 
                item.id === product.id && 
                item.size === selectedSize && 
                item.color === selectedColor
            );

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                    size: selectedSize,
                    color: selectedColor
                });
            }

            localStorage.setItem('shopCart', JSON.stringify(cart));
            
            if (typeof window.updateCartBadge === 'function') {
                window.updateCartBadge();
            }
            
            alert(`Successfully added ${quantity}x ${product.name} to your cart!`);
        });
    }
});