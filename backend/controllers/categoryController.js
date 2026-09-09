const Category = require('../models/categoryModel');

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch(err) {
        next(err);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            res.status(400);
            throw new Error('Category already exists');
        }
        const category = new Category({ name, description });
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch(err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch(err) {
        next(err);
    }
};

module.exports = { getCategories, createCategory, deleteCategory };
