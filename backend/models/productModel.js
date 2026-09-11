const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    name: { 
        type: String, 
        required: true 
    },
    images: [{ 
        type: String, 
        required: true 
    }],
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'Category' 
    },
    sizes: {
        'XX-Small': { type: Number, default: 0 },
        'X-Small': { type: Number, default: 0 },
        'Small': { type: Number, default: 0 },
        'Medium': { type: Number, default: 0 },
        'Large': { type: Number, default: 0 },
        'X-Large': { type: Number, default: 0 },
        'XX-Large': { type: Number, default: 0 },
        '3X-Large': { type: Number, default: 0 },
        '4X-Large': { type: Number, default: 0 }
    },
    quantity: { 
        type: Number, 
        default: 0 
    },
    status: { 
        type: String, 
        default: 'In Stock' 
    },
    
    rating: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    numReviews: { 
        type: Number, 
        required: true, 
        default: 0 
    }
}, { timestamps: true });

productSchema.pre('save', function () {
   
    if (this.sizes && typeof this.sizes === 'object') {
        this.quantity = Object.values(this.sizes).reduce((acc, val) => acc + (val || 0), 0);
    }
    
    if (this.quantity <= 0) {
        this.status = 'Out of Stock';
    } else {
        this.status = 'In Stock';
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
