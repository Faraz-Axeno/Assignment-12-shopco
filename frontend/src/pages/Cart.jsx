import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, cartTotals, applyCoupon, discount, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleApplyCoupon = () => {
        const code = couponCode.toUpperCase();
        if (code === 'SAVE10' || code === 'SAVE20') {
            applyCoupon(code);
            setCouponError('');
            toast.success(`Coupon ${code} applied successfully!`);
        } else {
            setCouponError('Invalid coupon code');
            toast.error('Invalid coupon code');
            applyCoupon('');
        }
    };

    const handleCheckout = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item.product,
                    qty: item.qty,
                    size: item.size
                })),
                shippingAddress: {
                    address: '123 Main St',
                    city: 'New York',
                    postalCode: '10001',
                    country: 'USA'
                },
                discountAmount: cartTotals.discountAmount
            };

            await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`, orderData, config);
            clearCart();
            toast.success('Order placed successfully!');
            setShowModal(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        }
    };

    if (cartItems.length === 0 && !showModal) {
        return (
            <div className="cart-empty-container">
                <h2>Your cart is empty</h2>
                <Link to="/products" className="cart-shop-link">Go Shopping</Link>
            </div>
        );
    }

    return (
        <main className="main-content">
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/" className="breadcrumb__link">Home</a> &gt; 
                <span className="breadcrumb__current" aria-current="page">Cart</span>
            </nav>

            <section className="cart">
                <div className="cart__container">
                    <h1 className="cart__title">YOUR CART</h1>
                    
                    <div className="cart__layout">
                        <div className="cart__items-wrapper">
                            <div className="cart__items-list">
                                {cartItems.map((item, index) => (
                                    <div key={item.product}>
                                        <article className="cart-item">
                                            <div className="cart-item__image-container">
                                                <img src={item.images?.[0] || item.image || '/images/default.png'} alt={item.name} className="cart-item__image" />
                                            </div>
                                            <div className="cart-item__info">
                                                <div className="cart-item__header">
                                                    <h3 className="cart-item__title"><Link to={`/product/${item.product}`} className="cart-item-link-override">{item.name}</Link></h3>
                                                    <button className="cart-item__delete-btn" aria-label="Remove item" onClick={() => removeFromCart(item.product)}>
                                                        <img src="/images/Delete-Dustbin.svg" alt="Delete" className="cart-item__delete-icon" />
                                                    </button>
                                                </div>
                                                <p className="cart-item__meta">Size: <span className="cart-item__meta-value">{item.size || 'Large'}</span></p>
                                                <p className="cart-item__meta">Color: <span className="cart-item__meta-value">{item.color || 'White'}</span></p>
                                                <div className="cart-item__footer">
                                                    <span className="cart-item__price">${item.price}</span>
                                                    <div className="quantity quantity--small">
                                                        <button className="quantity__btn quantity__btn--minus" aria-label="Decrease quantity" onClick={() => updateQty(item.product, Math.max(1, item.qty - 1))}>-</button>
                                                        <input type="number" className="quantity__input" value={item.qty} readOnly aria-label="Product quantity" />
                                                        <button className="quantity__btn quantity__btn--plus" aria-label="Increase quantity" onClick={() => updateQty(item.product, item.qty + 1)}>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                        {index < cartItems.length - 1 && <hr className="cart__divider" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <aside className="order-summary">
                            <h2 className="order-summary__title">Order Summary</h2>
                            
                            <div className="order-summary__row">
                                <span className="order-summary__label">Subtotal</span>
                                <span className="order-summary__value">${cartTotals.subtotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="order-summary__row">
                                <span className="order-summary__label">Discount {discount > 0 ? <span className="order-summary__discount-percent">(-{Math.round(discount * 100)}%)</span> : null}</span>
                                <span className="order-summary__value order-summary__value--danger">-${cartTotals.discountAmount.toFixed(2)}</span>
                            </div>
                            
                            <div className="order-summary__row">
                                <span className="order-summary__label">Delivery Fee</span>
                                <span className="order-summary__value">${cartTotals.deliveryFee.toFixed(2)}</span>
                            </div>
                            
                            <hr className="order-summary__divider" />
                            
                            <div className="order-summary__row order-summary__row--total">
                                <span className="order-summary__label">Total</span>
                                <span className="order-summary__value">${cartTotals.total.toFixed(2)}</span>
                            </div>

                            <div className="promo-code">
                                <div className="promo-code__input-wrapper">
                                    <img src="/images/Promo.svg" alt="Promo Tag" className="promo-code__icon" />
                                    <input type="text" className="promo-code__input" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Add promo code" />
                                </div>
                                <button className="promo-code__btn" onClick={handleApplyCoupon}>Apply</button>
                            </div>
                            
                            {couponError && <div className="promo-code__message promo-error-msg">{couponError}</div>}

                            <button className="checkout-btn" onClick={handleCheckout}>
                                Go to Checkout <img src="/images/arrow-right.svg" alt="Checkout" className="checkout-btn__icon" />
                            </button>
                        </aside>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="checkout-modal-overlay">
                    <div className="checkout-modal-content">
                        <div className="checkout-modal-icon">&#127881;</div>
                        <h2 className="checkout-modal-title">THANK YOU!</h2>
                        <p className="checkout-modal-text">Your order has been placed successfully. Thank you for shopping with SHOP.CO!</p>
                        <button 
                            onClick={() => {
                                setShowModal(false);
                                navigate('/profile');
                            }}
                            className="checkout-modal-btn"
                        >
                            View Order Details
                        </button>
                        <button 
                            onClick={() => {
                                setShowModal(false);
                                navigate('/');
                            }}
                            className="checkout-modal-btn-outline"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;
