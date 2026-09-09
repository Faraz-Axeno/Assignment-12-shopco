const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'Admin@123',
            isAdmin: true,
        });
        await adminUser.save();

        const cat1 = await Category.create({ name: 'Casual', description: 'Casual wear' });
        const cat2 = await Category.create({ name: 'Formal', description: 'Formal wear' });
        const cat3 = await Category.create({ name: 'Party', description: 'Party wear' });
        const cat4 = await Category.create({ name: 'Gym', description: 'Gym wear' });
        const allCats = [cat1._id, cat2._id, cat3._id, cat4._id];

        const sampleReviews = [
            {
                name: 'Samantha D.',
                rating: 4.5,
                comment: 'I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt.',
                date: 'August 14, 2023',
            },
            {
                name: 'Alex M.',
                rating: 4,
                comment: 'The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.',
                date: 'August 15, 2023',
            },
            {
                name: 'Ethan R.',
                rating: 3.5,
                comment: 'This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt.',
                date: 'August 16, 2023',
            },
            {
                name: 'Olivia P.',
                rating: 4,
                comment: 'As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out.',
                date: 'August 17, 2023',
            },
            {
                name: 'Liam K.',
                rating: 4,
                comment: 'This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer\'s skill. It\'s like wearing a piece of art that reflects my passion for both design and fashion.',
                date: 'August 18, 2023',
            },
            {
                name: 'Ava H.',
                rating: 4.5,
                comment: 'I\'m not just wearing a t-shirt; I\'m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.',
                date: 'August 19, 2023',
            }
        ];

        const baseProducts = [
            {
                user: adminUser._id,
                name: 'T-shirt with Tape Details',
                images: ['/images/product-1.png'],
                description: 'A stylish casual t-shirt.',
                price: 120,
                quantity: 10
            },
            {
                user: adminUser._id,
                name: 'Skinny Fit Jeans',
                images: ['/images/product-2.png'],
                description: 'Comfortable skinny fit jeans.',
                price: 240,
                quantity: 4
            },
            {
                user: adminUser._id,
                name: 'Checkered Shirt',
                images: ['/images/product-3.png'],
                description: 'Classic checkered shirt.',
                price: 180,
                quantity: 0
            },
            {
                user: adminUser._id,
                name: 'Sleeve Striped T-shirt',
                images: ['/images/product-4.png'],
                description: 'Comfortable striped t-shirt.',
                price: 130,
                quantity: 15
            },
            {
                user: adminUser._id,
                name: 'Polo with Contrast Trims',
                images: ['/images/product-5.png'],
                description: 'Elegant polo shirt.',
                price: 212,
                quantity: 2
            },
            {
                user: adminUser._id,
                name: 'Gradient Graphic T-shirt',
                images: ['/images/product-6.png'],
                description: 'Cool graphic t-shirt.',
                price: 145,
                quantity: 8
            },
            {
                user: adminUser._id,
                name: 'Polo with Tipping Details',
                images: ['/images/product-7.png'],
                description: 'Smart casual polo.',
                price: 180,
                quantity: 20
            },
            {
                user: adminUser._id,
                name: 'Black Striped T-shirt',
                images: ['/images/product-8.png'],
                description: 'Black and white striped t-shirt.',
                price: 150,
                quantity: 5
            }
        ];

        let productsToInsert = [];
        for (let i = 0; i < 45; i++) {
            const baseProduct = baseProducts[i % baseProducts.length];
            const name = i < baseProducts.length ? baseProduct.name : `${baseProduct.name} - Vol ${i + 1}`;
            
            // Assign category round robin
            const catId = allCats[i % allCats.length];
            
            productsToInsert.push({
                ...baseProduct,
                name,
                price: baseProduct.price + (i % 5) * 5,
                category: catId,
                reviews: sampleReviews,
                rating: 4.5,
                numReviews: sampleReviews.length
            });
        }

        await Product.create(productsToInsert);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error.stack);
        process.exit(1);
    }
};

importData();
