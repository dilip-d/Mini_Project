const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add all the details about your product']
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    offer: {
        type: Number,
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    subCategory: {
        type: String,
    },
    stock: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    image1: {
        type: String,
    },
    image2: {
        type: String,
    },
    image3: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    sales: {
        type: Number,
        default : 0
    }
}, { timestamps: true })

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;