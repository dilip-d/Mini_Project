const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CouponSchema = new Schema({
    couponCode: {
        type: String,
        trim: true,
        required: true,
    },
    couponValue: {
        type: Number,
        trim: true
    },
    minBill: {
        type: Number,
        trim: true
    },
    couponExpiry: {
        type: Date,
        trim: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    users: [{
        type: String,
        trim: true
    }],
}, { timestamps: true })

const Coupon = mongoose.model('Coupon', CouponSchema)
module.exports = Coupon;
