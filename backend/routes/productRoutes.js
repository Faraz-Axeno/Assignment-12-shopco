const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts);
router.route('/').post(protect, admin, createProduct);
router.route('/:id').get(getProductById);
router.route('/:id').put(protect, admin, updateProduct);
router.route('/:id').delete(protect, admin, deleteProduct);

module.exports = router;
