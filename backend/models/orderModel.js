const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
        {
            name: { 
                type: String, 
                required: true 
            },
            qty: { 
                type: Number, 
                required: true 
            },
            image: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, required: true 
            },
            size: {
                type: String
            },
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                required: true, ref: 'Product' 
            }
        }
    ],
    shippingAddress: {
        address: { 
            type: String, 
            required: true 
        },
        city: { 
            type: String, 
            required: true 
        },
        postalCode: { 
            type: String, 
            required: true 
        },
        country: { 
            type: String, 
            required: true 
        }
    },
    subtotal: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    discount: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    totalPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    status: { 
        type: String, 
        required: true, 
        default: 'Pending' 
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
