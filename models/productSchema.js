const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Admin-user-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add all the details about your product']
    },
    price: {
        type: Number,
        required: true
    },
    offer: {
        type: String,
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
        type: Number
    }
}, { timestamps: true })

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;