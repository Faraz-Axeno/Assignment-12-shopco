const express = require('express');
const router = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCart);
router.route('/').put(protect, updateCart);

module.exports = router;
