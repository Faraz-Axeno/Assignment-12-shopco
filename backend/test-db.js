const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Product = require('./models/productModel');
    const filter = { category: '6a9eda705dedb13fcfc7885e', price: { $gte: 0, $lte: 999999999 } };
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(12).skip(0);
    console.log('Count:', count);
    console.log('Products:', products.length);
    process.exit(0);
});
