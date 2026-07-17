const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String, // We will store the URL of the product image here
        required: true
    },
    category: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true // This automatically tracks when an item was created or updated
});

module.exports = mongoose.model('Product', productSchema);