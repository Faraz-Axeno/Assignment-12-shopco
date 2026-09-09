const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v2: cloudinary } = require('cloudinary');
const Product = require('./models/productModel');
const fs = require('fs');
const path = require('path');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const migrateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const products = await Product.find({});
        for (let product of products) {
            let updatedImages = [];
            let changed = false;
            
            for (let imgUrl of product.images) {
                if (imgUrl.startsWith('/images/')) {
                    const localPath = path.join(__dirname, '..', 'frontend', 'public', imgUrl);
                    if (fs.existsSync(localPath)) {
                        console.log("Uploading " + localPath + " to Cloudinary...");
                        const result = await cloudinary.uploader.upload(localPath, { folder: 'shopco_products' });
                        updatedImages.push(result.secure_url);
                        changed = true;
                    } else {
                        console.log("File not found: " + localPath);
                        updatedImages.push(imgUrl);
                    }
                } else {
                    updatedImages.push(imgUrl);
                }
            }

            if (changed) {
                product.images = updatedImages;
                await product.save();
                console.log("Updated product " + product.name + " with Cloudinary URLs.");
            }
        }
        console.log('Migration Complete');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrateImages();

