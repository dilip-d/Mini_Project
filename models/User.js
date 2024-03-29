const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { isEmail } = require('validator');

const cartSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    stock: { type: Number },
    count: { type: Number },
    total: { type: Number }
}, { timestamps: true })

const wishlistSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    stock: { type: Number },
    count: { type: Number }
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    stock: { type: Number },
    count: { type: Number },
    croppedImage: { type: String },
    offer: { type: Number },
    paymentOption: { type: String },
    address: { type: String },
    zip: { type: String },
    state: { type: String },
    country: { type: String },
    unique: { type: String },
    orderStatus: { type: String, default: 'Under process' }
}, { timestamps: true })

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: [true, 'Please enter first name'],
        minLength: [4, 'Name is too short!']
    },
    lname: {
        type: String,
        trim: true,
        required: [true, 'Please enter last name '],
        minLength: 1
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please enter an email'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    phonenumber: {
        type: String,
        trim: true,
        required: [true, 'Please enter the phone number'],
        minLength: 10,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}/.test(v);
            },
            message: '{VALUE} is not a valid 10 digit number!'
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please enter a password'],
        minLength: [3, 'Minimum password length is 3 characters']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    address: [{
        name: { type: String },
        mobile: { type: Number },
        address: { type: String },
        country: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    }],
    profileImage: {
        type: String,
        default: 'null'
    },
    cart: {
        type: [cartSchema],
        default: []
    },
    wishlist: {
        type: [wishlistSchema],
        default: []
    },
    order: {
        type: [orderSchema],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hashSync(this.password, 10)
    next();
})

userSchema.methods.comparePassword = function (plainText, callback) {
    return callback(null, bcrypt.compareSync(plainText, this.password))
}

//static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            if (user.isBlocked == false) {
                return user;
            }
            throw Error('Your account is blocked');
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

//fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
    next();
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;