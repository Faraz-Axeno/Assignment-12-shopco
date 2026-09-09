const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus, getDashboardStats, cancelOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
