const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const fixArray = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const products = await db.collection('products').find({}).toArray();
        for (let p of products) {
            if (p.images && !Array.isArray(p.images)) {
                let arr = [];
                if (p.images['0']) arr.push(p.images['0']);
                else arr.push('/images/product-1.png');
                await db.collection('products').updateOne({ _id: p._id }, { $set: { images: arr } });
            } else if (!p.images || p.images.length === 0) {
                 await db.collection('products').updateOne({ _id: p._id }, { $set: { images: ['/images/product-1.png'] } });
            }
        }
        console.log('Fixed arrays!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixArray();
