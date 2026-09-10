const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const addOrderItems = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, discountAmount } = req.body;

        if (!orderItems || orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            let subtotal = 0;
            const verifiedOrderItems = [];

            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    res.status(404);
                    throw new Error(`Product not found: ${item.product}`);
                }

                // Check size-specific inventory
                const sizeStock = product.sizes && product.sizes[item.size] ? product.sizes[item.size] : 0;
                if (sizeStock < item.qty) {
                    res.status(400);
                    throw new Error(`Insufficient inventory for product: ${product.name} (Size: ${item.size})`);
                }

                const itemPrice = product.price;
                subtotal += itemPrice * item.qty;

                verifiedOrderItems.push({
                    name: product.name,
                    qty: item.qty,
                    image: product.images[0],
                    price: itemPrice,
                    size: item.size,
                    product: product._id
                });
            }

            const discount = Number(discountAmount) || 0;
            let totalPrice = subtotal - discount;
            if (totalPrice < 0) totalPrice = 0;

            const order = new Order({
                orderItems: verifiedOrderItems,
                user: req.user._id,
                shippingAddress,
                subtotal,
                discount,
                totalPrice
            });

            const createdOrder = await order.save();

            for (const item of verifiedOrderItems) {
                const product = await Product.findById(item.product);
                if (product.sizes && product.sizes[item.size] !== undefined) {
                    product.sizes[item.size] -= item.qty;
                    product.markModified('sizes');
                    await product.save();
                }
            }

            res.status(201).json(createdOrder);
        }
    } catch(err) {
        next(err);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch(err) {
        next(err);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order && (req.user.isAdmin || order.user._id.toString() === req.user._id.toString())) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch(err) {
        next(err);
    }
};

// Admin
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch(err) {
        next(err);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch(err) {
        next(err);
    }
};

// Dashboard Stats
const getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCategories = await require('../models/categoryModel').countDocuments();
        const totalUsers = await require('../models/userModel').countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const outOfStockProducts = await Product.countDocuments({ quantity: { $lte: 0 } });
        const lowStockProducts = await Product.countDocuments({ quantity: { $gt: 0, $lte: 5 } }); // Threshold 5

        res.json({
            totalProducts,
            totalCategories,
            totalUsers,
            totalOrders,
            outOfStockProducts,
            lowStockProducts
        });
    } catch (err) {
        next(err);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check permissions: only admin or the user who placed the order can cancel
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(401);
            throw new Error('Not authorized to cancel this order');
        }

        // Check if order can be cancelled
        if (order.status === 'Shipped' || order.status === 'Delivered') {
            res.status(400);
            throw new Error('Cannot cancel an order that has already been shipped or delivered');
        }

        if (order.status === 'Cancelled') {
            res.status(400);
            throw new Error('Order is already cancelled');
        }

        order.status = 'Cancelled';
        await order.save();

        // Rollback inventory
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product && product.sizes && product.sizes[item.size] !== undefined) {
                product.sizes[item.size] += item.qty;
                product.markModified('sizes');
                await product.save();
            }
        }

        res.json({ message: 'Order cancelled successfully', order });
    } catch (err) {
        next(err);
    }
};

module.exports = { cancelOrder,  addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus, getDashboardStats };
