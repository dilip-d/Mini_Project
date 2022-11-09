const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
}, { timestamps: true })

const bannerModel = mongoose.model('banner', bannerSchema);

module.exports = bannerModel;