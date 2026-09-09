const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const products = await db.collection('products').find({ name: /Classic T-Shirt/i }).toArray();
        console.log('Found ' + products.length + ' Classic T-Shirts.');
        const result = await db.collection('products').updateMany(
            { name: /Classic T-Shirt/i },
            { $set: { "images.0": "/images/product-1.png" } }
        );
        console.log('Updated ' + result.modifiedCount + ' products.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixImages();
