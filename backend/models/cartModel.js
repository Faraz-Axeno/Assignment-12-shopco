const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    cartItems: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                required: true, 
                ref: 'Product' 
            },
            name: { 
                type: String, 
                required: true },
            images: [{ 
                type: String 
            }],
            price: { 
                type: Number, 
                required: true 
            },
            qty: { 
                type: Number, 
                required: true 
            },
            color: { 
                type: String 

            },
            size: { 
                type: String 
            }
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
