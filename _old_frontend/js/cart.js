document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('#cart-items-container');
    const cartEmptyState = document.querySelector('#cart-empty-state');
    if (!cartItemsContainer) return;

    const orderSummary = document.querySelector('.order-summary');
    const summarySubtotal = document.querySelector('#summary-subtotal');
    const summaryDiscountPercent = document.querySelector('#summary-discount-percent');
    const summaryDiscount = document.querySelector('#summary-discount');
    const summaryDelivery = document.querySelector('#summary-delivery');
    const summaryTotal = document.querySelector('#summary-total');
    
    const promoInput = document.querySelector('#promo-input');
    const applyPromoBtn = document.querySelector('#apply-promo-btn');
    const promoMessage = document.querySelector('#promo-message');
    const checkoutBtn = document.querySelector('#checkout-btn');

    const DELIVERY_FEE = 15.00;
    let cart = JSON.parse(localStorage.getItem('shopCart')) || [];
    let currentDiscountPercent = 0;
    let activeCouponCode = null;

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartEmptyState.style.display = 'block';
            orderSummary.style.opacity = '0.5';
            checkoutBtn.disabled = true;
            checkoutBtn.style.cursor = 'not-allowed';
            
            summarySubtotal.textContent = '$0';
            summaryDiscount.textContent = '$0';
            summaryDelivery.textContent = '$0';
            summaryTotal.textContent = '$0';
            if(summaryDiscountPercent) summaryDiscountPercent.textContent = '';
            return;
        }

        cartItemsContainer.style.display = 'block';
        cartEmptyState.style.display = 'none';
        orderSummary.style.opacity = '1';
        checkoutBtn.disabled = false;
        checkoutBtn.style.cursor = 'pointer';

        cart.forEach((item, index) => {
            const divider = index > 0 ? `<hr class="cart__divider">` : '';
            
            cartItemsContainer.innerHTML += `
                ${divider}
                <article class="cart-item">
                    <div class="cart-item__image-container">
                        <img class="cart-item__image" src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item__info">
                        <div class="cart-item__header">
                            <h3 class="cart-item__title">${item.name}</h3>
                            <button class="cart-item__delete-btn" onclick="removeCartItem(${index})">
                                <img src="images/Delete-Dustbin.svg" alt="Delete">
                            </button>
                        </div>
                        <p class="cart-item__meta">Size: <span class="cart-item__meta-value">${item.size}</span></p>
                        <p class="cart-item__meta">Color: <span class="cart-item__meta-value">${item.color}</span></p>
                        <div class="cart-item__footer">
                            <span class="cart-item__price">$${item.price}</span>
                            <div class="quantity quantity--small">
                                <button class="quantity__btn" onclick="updateCartItem(${index}, -1)">-</button>
                                <input class="quantity__input" type="number" value="${item.quantity}" readonly>
                                <button class="quantity__btn" onclick="updateCartItem(${index}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        });

        calculateTotals();
    }

    window.updateCartItem = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
            saveAndRender();
        }
    };

    window.removeCartItem = (index) => {
        cart.splice(index, 1);
        saveAndRender();
    };

    function saveAndRender() {
        localStorage.setItem('shopCart', JSON.stringify(cart));
        renderCart();
        if(typeof window.updateCartBadge === 'function') window.updateCartBadge();
    }

    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            const code = promoInput.value.trim().toUpperCase();

            if (code === 'SAVE10') {
                currentDiscountPercent = 0.10;
                activeCouponCode = code;
                promoMessage.innerHTML = '<span class="promo-msg promo-msg--success">10% Discount Applied!</span>';
            } else if (code === 'SAVE20') {
                currentDiscountPercent = 0.20;
                activeCouponCode = code;
                promoMessage.innerHTML = '<span class="promo-msg promo-msg--success">20% Discount Applied!</span>';
            } else {
                currentDiscountPercent = 0;
                activeCouponCode = null;
                promoMessage.innerHTML = '<span class="promo-msg promo-msg--error">Invalid coupon code.</span>';
            }
            calculateTotals();
        });
    }

    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = subtotal * currentDiscountPercent;
        const total = subtotal - discountAmount + DELIVERY_FEE;

        summarySubtotal.textContent = `$${subtotal}`;
        summaryDelivery.textContent = `$${DELIVERY_FEE}`;
        
        if (discountAmount > 0) {
            summaryDiscount.textContent = `-$${Math.round(discountAmount)}`;
            if(summaryDiscountPercent) summaryDiscountPercent.textContent = `(-${currentDiscountPercent * 100}%)`;
            summaryDiscount.parentElement.style.display = 'flex';
        } else {
            summaryDiscount.textContent = `$0`;
            if(summaryDiscountPercent) summaryDiscountPercent.textContent = '';
        }

        summaryTotal.textContent = `$${Math.round(total)}`;
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal__content">
                    <div class="modal__icon">✓</div>
                    <h2 class="modal__title">Order Successful!</h2>
                    <p class="modal__description">Your order has been placed successfully. Thank you!</p>
                    <button class="modal__btn" id="closeModalBtn">OK</button>
                </div>
            `;
            document.body.appendChild(modal);
            document.querySelector('#closeModalBtn').addEventListener('click', () => {
                cart = []; 
                localStorage.removeItem('shopCart'); 
                window.location.href = 'index.html'; 
            });
        });
    }
    renderCart();
});