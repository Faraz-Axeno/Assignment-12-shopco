const Product = require('../models/productModel');

const getProducts = async (req, res, next) => {
    try {
        const pageSize = Number(req.query.pageSize) || 12;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? { name: { $regex: req.query.keyword, $options: 'i' } }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};
        
        let minPrice = 0;
        let maxPrice = 999999999;
        if (req.query.minPrice) minPrice = Number(req.query.minPrice);
        if (req.query.maxPrice) maxPrice = Number(req.query.maxPrice);
        const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

        const availability = req.query.inStock === 'true' ? { quantity: { $gt: 0 } } : {};

        const filter = { ...keyword, ...category, ...priceFilter, ...availability };

        let sort = {};
        switch (req.query.sort) {
            case 'price_asc':
                sort = { price: 1 };
                break;
            case 'price_desc':
                sort = { price: -1 };
                break;
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'name':
                sort = { name: 1 };
                break;
            default:
                sort = { createdAt: -1 };
                break;
        }

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sort)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('category', 'name');

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch(err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch(err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, images, category, quantity } = req.body;

        if (!name || name.trim() === '') {
            res.status(400);
            throw new Error('Product name is required');
        }
        if (price === undefined || price < 0) {
            res.status(400);
            throw new Error('Valid product price is required');
        }
        if (!category) {
            res.status(400);
            throw new Error('Product category is required');
        }

        const product = new Product({
            name: name,
            price: price,
            user: req.user._id,
            images: images && images.length > 0 ? images : ['/images/sample.jpg'],
            category: category,
            quantity: quantity || 0,
            description: description || 'No description provided',
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch(err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, images, category, quantity } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            if (name !== undefined && name.trim() === '') {
                res.status(400);
                throw new Error('Product name cannot be empty');
            }
            if (price !== undefined && price < 0) {
                res.status(400);
                throw new Error('Product price cannot be negative');
            }

            product.name = name || product.name;
            product.price = price !== undefined ? price : product.price;
            product.description = description || product.description;
            if (images && images.length > 0) {
                product.images = images;
            }
            product.category = category || product.category;
            product.quantity = quantity !== undefined ? quantity : product.quantity;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch(err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch(err) {
        next(err);
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
