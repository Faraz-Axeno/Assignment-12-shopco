const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const products = await db.collection('products').find({ name: /Classic T-Shirt/i }).limit(1).toArray();
        console.log(JSON.stringify(products, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkImages();
