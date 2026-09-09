const Cart = require('../models/cartModel');

const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, cartItems: [] });
        }
        res.json(cart);
    } catch (error) {
        next(error);
    }
};

const updateCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.cartItems = req.body.cartItems;
            const updatedCart = await cart.save();
            res.json(updatedCart);
        } else {
            const newCart = await Cart.create({
                user: req.user._id,
                cartItems: req.body.cartItems
            });
            res.json(newCart);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getCart, updateCart };
