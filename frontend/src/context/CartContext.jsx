import { createContext, useState, useEffect, useMemo, useCallback, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [discount, setDiscount] = useState(0);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Clean up legacy localStorage cart to prevent confusion
        localStorage.removeItem('cartItems');
        
        if (user) {
            isFirstRender.current = true; // reset on user change
            const fetchCart = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get('http://localhost:5000/api/cart', config);
                    setCartItems(data.cartItems || []);
                } catch (error) {
                    console.error('Failed to fetch cart', error);
                }
            };
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (user) {
            const syncCart = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    await axios.put('http://localhost:5000/api/cart', { cartItems }, config);
                } catch (error) {
                    console.error('Failed to sync cart', error);
                }
            };
            syncCart();
        }
    }, [cartItems, user]);

    const addToCart = useCallback((product, qty, color, size) => {
        setCartItems((prev) => {
            const existItem = prev.find((x) => x.product === product._id && x.color === color && x.size === size);
            if (existItem) {
                return prev.map((x) => 
                    x.product === existItem.product && x.color === color && x.size === size
                        ? { ...product, product: product._id, qty: x.qty + qty, color, size } 
                        : x
                );
            } else {
                return [...prev, { ...product, product: product._id, qty, color, size }];
            }
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems((prev) => prev.filter((x) => x.product !== id));
    }, []);

    const updateQty = useCallback((id, qty) => {
        setCartItems((prev) => prev.map((x) => (x.product === id ? { ...x, qty } : x)));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        setDiscount(0);
    }, []);

    const applyCoupon = useCallback((code) => {
        if (code === 'SAVE10') {
            setDiscount(0.1);
        } else if (code === 'SAVE20') {
            setDiscount(0.2);
        } else {
            setDiscount(0);
        }
    }, []);

    const cartTotals = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => {
            const price = parseFloat(item.price) || 0;
            const qty = parseInt(item.qty) || 0;
            return acc + (price * qty);
        }, 0);
        const discountAmount = subtotal * discount;
        const deliveryFee = subtotal > 0 ? 15 : 0;
        const total = subtotal - discountAmount + deliveryFee;
        
        return { subtotal, discountAmount, deliveryFee, total };
    }, [cartItems, discount]);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQty, 
            clearCart,
            applyCoupon,
            discount,
            cartTotals 
        }}>
            {children}
        </CartContext.Provider>
    );
};
