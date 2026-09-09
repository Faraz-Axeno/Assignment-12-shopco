import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

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
        } else {
            setCouponError('Invalid coupon code');
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

            await axios.post('http://localhost:5000/api/orders', orderData, config);
            clearCart();
            setShowModal(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Checkout failed');
        }
    };

    if (cartItems.length === 0 && !showModal) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'Satoshi, sans-serif' }}>
                <h2>Your cart is empty</h2>
                <Link to="/products" style={{ display: 'inline-block', marginTop: '20px', padding: '15px 30px', background: '#000', color: '#fff', borderRadius: '30px', textDecoration: 'none' }}>Go Shopping</Link>
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
                                                    <h3 className="cart-item__title"><Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>{item.name}</Link></h3>
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
                            
                            {couponError && <div className="promo-code__message" style={{ color: 'red' }}>{couponError}</div>}

                            <button className="checkout-btn" onClick={handleCheckout}>
                                Go to Checkout <img src="/images/arrow-right.svg" alt="Checkout" className="checkout-btn__icon" />
                            </button>
                        </aside>
                    </div>
                </div>
            </section>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '40px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>&#127881;</div>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>THANK YOU!</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>Your order has been placed successfully. Thank you for shopping with SHOP.CO!</p>
                        <button 
                            onClick={() => {
                                setShowModal(false);
                                navigate('/profile');
                            }}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '30px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            View Order Details
                        </button>
                        <button 
                            onClick={() => {
                                setShowModal(false);
                                navigate('/');
                            }}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: 'transparent',
                                color: '#000',
                                border: 'none',
                                marginTop: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
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
