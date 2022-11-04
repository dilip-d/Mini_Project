const User = require('../models/User');
const Product = require('../models/productSchema');
const Coupon = require("../models/couponSchema");
const jwt = require('jsonwebtoken');
const { handleErrors } = require('../middleware/errHandlingMiddleware');
const { loginerrorhandler } = require('../middleware/errHandlingMiddleware');
require('dotenv').config();
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');

//paypal
const fetch = require('node-fetch')
const base = "https://api-m.sandbox.paypal.com";

var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'the secret', {
        expiresIn: maxAge
    })
}

module.exports.homepage_get = async (req, res) => {
    console.log('find product for user');
    try {
        const products = await Product.find({});
        console.log('found');
        res.render('./user/index', { product: products, layout: "./layouts/layout.ejs", title: 'Home page', admin: false })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.userSignup_get = (req, res) => {
    res.render('./user/userSignup.ejs', { title: 'signup' });
}

module.exports.otpSignup_get = (req, res) => {
    res.render('./user/otpSignup.ejs', { title: 'OTP' })
}

module.exports.sendOtp = async (req, res) => {
    console.log('hai sending otp');
    const data = req.body;
    console.log(data.phonenumber);
    await client.verify.services(process.env.serviceID)
        .verifications
        .create({ to: `+91${req.body.phonenumber}`, channel: 'sms' })
        .then(verification => console.log(verification.status))

        .catch(e => {
            console.log('error catch');
            console.log(e);
            res.status(500).send(e);
        })
    console.log('verification send');
    res.sendStatus(200);
}

module.exports.otpVerification = async (req, res) => {

    console.log('otpverificatin in');
    console.log(req.body);
    const check = await client.verify.services(process.env.serviceID)
        .verificationChecks
        .create({ to: `+91${req.body.phonenumber}`, code: req.body.otp })
        .catch(e => {
            console.log(e);
            res.status(500).send(e);
        })

    if (check.status === 'approved') {
        let email = req.body.email;
        await User.findOneAndUpdate({ email: email }, { isVerified: true });
    }
    res.status(200).json(check.status);
}

module.exports.userSignup_post = async (req, res) => {
    console.log('Sign up post..');

    try {
        const { fname, lname, email, phonenumber, password } = req.body;
        const user = await User.create({ fname, lname, email, phonenumber, password });
        console.log('try to save data on db');
        res.status(201).json({ user });
        console.log(user);

    } catch (errors) {
        console.log(errors);
        const errorHandler = handleErrors(errors);
        console.log(errorHandler);
        res.status(400).json({ errorHandler });
    }
}

// module.exports.userLogin_get = (req, res) => {
//     res.render('./user/userLogin.ejs', { title: 'login' });
// }

module.exports.userLogin_post = async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user });
        console.log(user + "logged in");

    } catch (errors) {
        console.log(errors);
        const errorHandle = loginerrorhandler(errors);
        res.status(400).json({ errorHandle });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.mensWatch_get = async (req, res) => {
    console.log('find product for user');
    try {
        const products = await Product.find({});
        console.log('found');
        res.render('./user/mensWatch', { product: products, layout: "./layouts/layout.ejs", title: 'Mens watch', admin: false })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.womensWatch_get = async (req, res) => {
    console.log('find product for user');
    try {
        const products = await Product.find({});
        console.log('found');
        res.render('./user/womensWatch', { product: products, layout: "./layouts/layout.ejs", title: 'Womens watch', admin: false })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.userCart_get = async (req, res) => {
    console.log('in cart');
    try {
        let Curuser = req.user.id
        const users = await User.findById({ _id: Curuser })
        let a = users
        const sum = function (items, p1, p2) {
            return items.reduce(function (a, b) {
                return parseInt(a) + (parseInt(b[p1]) * parseInt(b[p2]))
            }, 0)
        }
        const total = sum(users.cart, 'price', 'count')
        res.render('./user/cart.ejs', { user: users.cart, totals: total, b: a, layout: './layouts/layout.ejs', title: 'checkout', admin: false })

    } catch (err) {
        console.log(err);
    }
}

module.exports.addToCart_post = async (req, res) => {
    console.log('add to cart post');

    const id = req.body.id;
    let userr = req.user.id

    let product = await Product.findById({ _id: id })
    product = product.toJSON()
    product.count = 1;

    const userid = await User.findById({ _id: userr })
    const checks = userid.cart;
    let n = 0;
    for (const check of checks) {
        if (check._id == id) {
            await User.updateOne({ _id: req.user.id, 'cart._id': req.body.id },
                { $inc: { "cart.$.count": 1 } })
            n++
        }
    }
    if (n > 0) {
        res.redirect('back')
    }
    else {
        const neww = await User.updateOne({ _id: req.user.id }, { $push: { cart: product } })
        res.redirect('back')
    }
}

module.exports.incrementCartCount = async (req, res) => {
    console.log('increment');
    const prodId = req.params.id
    let product = await Product.findById(prodId)

    let userr = req.user.id
    const userid = await User.findById({ _id: userr })

    const checks = userid.cart;
    let n = 0;
    for (const check of checks) {
        if (check._id == prodId) {
            await User.updateOne({ _id: userr, 'cart._id': req.params.id },
                { $inc: { "cart.$.count": 1 } })
            n++
        }
    }
    if (n > 0) {
        res.redirect('back')
    }
    else {
        const neww = await User.updateOne({ _id: req.user.id }, { $push: { cart: product } })
        res.redirect('back')
    }
}

module.exports.decrementCartCount = async (req, res) => {
    console.log('decrement');
    let prodId = req.params.id
    let product = await Product.findById(prodId)
    let userr = req.user.id
    const userid = await User.findById({ _id: userr })
    try {

        const checks = userid.cart;
        let n = 0;
        for (const check of checks) {
            if (check._id == prodId && check.count > 1) {
                await User.updateOne({ _id: userr, 'cart._id': req.params.id },
                    { $inc: { "cart.$.count": -1 } })
                n++
            }
        }
        if (n > 0) {
            res.redirect('back')
        }
        else {
            await User.findOneAndUpdate({ _id: userr }, { $pull: { cart: { _id: prodId } } })
        }
        res.redirect('/userCart')
    } catch (err) {
        console.log(err);
    }
}

module.exports.removeFromCart = async (req, res) => {

    let prodId = req.params.id
    let product = await Product.findById(prodId)
    let userr = req.user.id
    const userid = await User.findById({ _id: userr })
    try {
        await User.findOneAndUpdate({ _id: userr }, { $pull: { cart: { _id: prodId } } })
        res.redirect('/userCart')
    } catch (err) {
        console.log(err);
    }
}

//wishlist get/add/remove
module.exports.userWishlist_get = async (req, res) => {
    console.log('in wishlist');
    try {
        let Curuser = req.user.id

        const users = await User.findById({ _id: Curuser })
        const sum = function (items, p1, p2) {
            return items.reduce(function (a, b) {
                return parseInt(a) + (parseInt(b[p1]) * parseInt(b[p2]))
            }, 0)
        }
        const total = sum(users.wishlist, 'price', 'count')
        res.render('./user/wishlist.ejs', { user: users.wishlist, totals: total, layout: './layouts/layout.ejs', title: 'Wishlist', admin: false })

    } catch (err) {
        console.log(err);
    }
}

module.exports.moveToCart = async (req, res) => {
    console.log('moving to cart');
    const prodId = req.params.id
    let product = await Product.findById(prodId)

    let userr = req.user.id
    const userid = await User.findById({ _id: userr })

    try {
        const checks = userid.cart;
        let n = 0;
        for (const check of checks) {
            if (check._id == prodId) {
                await User.updateOne({ _id: userr, 'cart._id': req.params.id },
                    { $inc: { "cart.$.count": 1 } })
                n++
            }
        }
        if (n > 0) {
            res.redirect('back')
        }
        else {
            product = product.toJSON()
            product.count = 1;
            const neww = await User.updateOne({ _id: req.user.id }, { $push: { cart: product } })
        }
        await User.findOneAndUpdate({ _id: userr }, { $pull: { wishlist: { _id: prodId } } })
        res.redirect('/userWishlist')
    } catch (err) {
        console.log(err);
    }
}

module.exports.addToWishlist_post = async (req, res) => {

    const id = req.body.id;
    let userr = req.user.id

    let product = await Product.findById({ _id: id })
    product = product.toJSON()
    product.count = 1;

    const userid = await User.findById({ _id: userr })
    const checks = userid.wishlist;
    let n = 0;
    for (const check of checks) {
        if (check._id == id) {
            await User.updateOne({ _id: req.user.id, 'wishlist._id': req.body.id },
                { $inc: { "wishlist.$.count": 1 } })
            n++
        }
    }
    if (n > 0) {
        res.redirect('back')
    }
    else {
        const neww = await User.updateOne({ _id: req.user.id }, { $push: { wishlist: product } })
        res.redirect('back')
    }
}

module.exports.addToWishlist = async (req, res) => {

    const prodId = req.params.id
    let product = await Product.findById(prodId)

    let userr = req.user.id
    const userid = await User.findById({ _id: userr })

    const checks = userid.wishlist;
    let n = 0;
    for (const check of checks) {
        if (check._id == prodId) {
            await User.updateOne({ _id: userr, 'wishlist._id': req.params.id },
                { $inc: { "wishlist.$.count": 1 } })
            n++
        }
    }
    if (n > 0) {
        res.redirect('back')
    }
    else {
        const neww = await User.updateOne({ _id: req.user.id }, { $push: { wishlist: product } })
        res.redirect('back')
    }
}

module.exports.removeFromWishlist = async (req, res) => {

    let prodId = req.params.id
    let product = await Product.findById(prodId)
    let userr = req.user.id
    const userid = await User.findById({ _id: userr })
    try {
        await User.findOneAndUpdate({ _id: userr }, { $pull: { wishlist: { _id: prodId } } })
        res.redirect('/userWishlist')
    } catch (err) {
        console.log(err);
    }
}

module.exports.singleProductView_get = async (req, res) => {
    let prodId = req.query.id
    console.log(prodId);
    let product = await Product.findById(prodId)

    res.render('./user/singleProductview.ejs', { product, layout: "./layouts/layout.ejs", title: 'Single v', admin: false })
}

// user Profile view edit
module.exports.userProfile_get = async (req, res) => {
    console.log('profile getttt');
    let user = req.user.id
    console.log(user);
    const profile = await User.findById({ _id: user })

    res.render('./user/profile.ejs', { profile, layout: "./layouts/layout.ejs", title: 'User profile', admin: false })
}

module.exports.editProfile_get = async (req, res) => {
    console.log('edit profile getttt');
    let user = req.user.id
    console.log(user);
    const profile = await User.findById({ _id: user })

    res.render('./user/editProfile.ejs', { profile, layout: "./layouts/layout.ejs", title: 'User profile', admin: false })
}

module.exports.addAddress = async (req, res) => {
    console.log('add address');
    let user = req.user.id
    console.log(user);
    const profile = await User.findById({ _id: user })

    res.render('./user/addAddress.ejs', { profile, layout: "./layouts/layout.ejs", title: 'Add Address', admin: false })
}

module.exports.addAddress_post = async (req, res) => {

    try {
        const user = req.user.id;
        const result = req.body;
        const userid = await User.findById({ _id: user })

        await User.updateOne({ _id: user },
            {
                $push: {
                    address: {
                        address: result.address,
                        city: result.city,
                        country: result.country,
                        state: result.state,
                        zip: result.zip,
                    }
                }
            })
        res.redirect('/userProfile')
    } catch (err) {
        console.log(err);
    }
}

module.exports.editProfile_post = async (req, res) => {
    const user = req.params.id
    console.log('edit profile post');
    const result = req.body;

    try {
        await User.updateOne({ _id: user }, {

            $set: {
                address: {
                    address: result.address,
                    zip: result.zip
                },
                fname: result.fname,
                lname: result.lname,
                email: result.email,
                phonenumber: result.phonenumber
            }
        })
        res.redirect('/userProfile');

    } catch (err) {
        console.log(err);
    }
}

module.exports.checkout_get = async (req, res) => {
    console.log('checkoutttt');
    try {
        let id = req.user.id
        const coupon = await Coupon.find()
        const users = await User.findById({ _id: id })
        const sum = function (items, p1, p2) {
            return items.reduce(function (a, b) {
                return parseInt(a) + (parseInt(b[p1]) * parseInt(b[p2]))
            }, 0)
        }
        total = sum(users.cart, 'price', 'count')
        const thisuser = users;

        res.render('./user/checkout.ejs', {coupon, user: users.cart, totals: total, profile: thisuser, layout: './layouts/layout.ejs', title: 'checkout', admin: false })

    } catch (err) {
        console.log(err);
    }
}

module.exports.orderStatus_get = async (req, res) => {
    console.log('order placed');
    res.render('./user/orderStatus.ejs', { layout: './layouts/layout.ejs', title: 'Order status', admin: false })
}

let address;
let payment;

module.exports.checkout_post = async (req, res) => {
    console.log('checkout submit');
    console.log(req.body);
    address = req.body.address;
    payment = req.body.payment;
    let id = req.user.id;

    const result = await User.findOne({ _id: id });
    const cartItems = result.cart;

    if (payment == 'Razorpay') {
        let { amount, currency } = req.body;
        amount = amount * 100;
        console.log(amount);
        console.log(currency);
        console.log(typeof amount);

        instance.orders.create({ amount, currency }, (err, order) => {
            // console.log(order);
            res.json(order)
        })
    } else if (payment == 'Paypal') {
        console.log('in paypal');
        const order = { id: 'Paypal' };
        console.log(order);
        res.json(order);
    } else {
        res.redirect('/saveOrder')
    }
}

module.exports.saveOrder = async (req, res) => {
    console.log('save order');
    let id = req.user.id;
    // address = req.body.address;
    // payment = req.body.payment;

    try {
        const result = await User.findOne({ _id: id });
        let cartItems = result.cart;

        // console.log(result);

        for (let cartItem of cartItems) {
            cartItem = cartItem.toJSON()
            cartItem.address = address
            cartItem.paymentOption = payment
            cartItem.unique = uuidv4()
            cartItem.orderStatus = 'Order is under process'
            stockId = cartItem._id
            salesCount = cartItem.count
            removeCount = cartItem.count * -1;

            await User.findOneAndUpdate({ _id: id }, { $push: { order: cartItem } })
            //empty cart
            await User.findOneAndUpdate({ _id: id }, { $set: { cart: [] } })

            await Product.findOneAndUpdate({ "_id": stockId }, { $inc: { "stock": removeCount, "sales": salesCount } })

            res.status(200).json({ success: 'true' });
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.verifyPaymentRazorpay = async (req, res) => {
    console.log('verifying razorpay');
    console.log(req.body);

    //creating hmac object
    const crypto = require("crypto");
    let hmac = crypto.createHmac('sha256', process.env.key_secret);

    //Passing the data to be hashed
    hmac.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id);

    //creating the hmac in the required format
    const generated_signature = hmac.digest('hex');

    var response = { signatureIsValid: "false" }
    if (generated_signature === req.body.razorpay_signature) {
        response = { signatureIsValid: "true" }
        console.log("signatureIsvalid");
        res.json(response);
    } else {
        res.send(response);
    }
}

module.exports.orderDetails_get = async (req, res) => {
    console.log('order details');
    let user = req.user.id
    console.log(user);
    try {
        const profile = await User.findById({ _id: user })

        const result = profile.order
        // console.log(result);

        res.render('./user/orderDetails.ejs', { user, result, layout: './layouts/layout.ejs', title: 'Order details', admin: false })
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.cancelOrder = (req, res) => {
    console.log('cancelling in order');
    const user = req.user.id;
    // a=user.cart
    console.log(user);
    uniqueId = req.params.id;
    console.log(uniqueId);
    if (user) {
        console.log('after unique iddddddd');
        User.findOne({ user: uniqueId })
            .then((result) => {
                // console.log(result)

                const orders = result.order
                console.log(orders)

                for (let order of orders) {
                    order = order.toJSON();
                    console.log('order of ordersss');
                    if (order.unique === uniqueId) {
                        console.log('going for update');
                        Promise.all([(User.updateOne({ "_id": user, "order.unique": uniqueId }, { $set: { "order.$.orderStatus": "Order cancelled" } })), (Product.updateOne({ "_id": order._id }, { $inc: { "stock": order.count ,"sales": (order.count * -1)} }))])
                            .then((result) => {
                                res.redirect('/orderDetails')
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                }
            })
    } else {
        res.redirect('/userLogin')
    }
}

//copy
// const cancelOrderGet = (req, res) => {
//     session = req.session;
//     uniqueId = req.params.id;
//     if (session.userId) {
//         User.findOne({ _id: session.uid })
//             .then((result) => {
//                 // console.log(result)

//                 const orders = result.order

//                 console.log(orders)

//                 for (let order of orders) {
//                     order = order.toJSON();
//                     if (order.unique === uniqueId) {
//                         Promise.all([(User.updateOne({ "name": session.userId, "order.unique": uniqueId }, { $set: { "order.$.orderStatus": "Order cancelled" } })), (Product.updateOne({ "_id": order._id }, { $inc: { "stock": order.count, "sales": (order.count * -1) } }))])
//                             .then((result) => {
//                                 res.redirect('/order')
//                             })
//                             .catch((err) => {
//                                 console.log(err)
//                             })
//                     }
//                 }
//             })
//     } else {
//         res.redirect('/login')
//     }
// }

// const { paypalClientid, paypalClientsecret } = process.env;
module.exports.paymentPaypal = async (req, res) => {
    console.log('in payment paypal');
    console.log(req.body);
    const { amount, currency } = req.body;
    let orderAmt = amount / 80
    let orderAmount = (Math.round(orderAmt * 100) / 100).toFixed(2);
    console.log(orderAmount)
    const order = await createOrder(orderAmount);
    console.log(order);
    console.log(order.id);
    res.json(order);
}

// capture payment & store order information or fullfill order
module.exports.verifyPaymentPaypal = async (req, res) => {
    console.log('in verify payment paypal');
    console.log(req.params)
    const orderID = req.params.id;
    console.log(orderID)
    const captureData = await capturePayment(orderID);
    // TODO: store payment information such as the transaction ID
    res.json(captureData);
};

//////////////////////
// PayPal API helpers
//////////////////////

// use the orders api to create an order
async function createOrder(orderAmount) {

    console.log('in create Order paypal');
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: orderAmount,
                    },
                },
            ],
        }),
    });
    const data = await response.json();
    console.log(data)
    return data;
}

// use the orders api to capture payment for an order
async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}

// generate an access token using client id and app secret
async function generateAccessToken() {
    console.log('in generate token');
    const auth = Buffer.from(process.env.paypalClientid + ":" + process.env.paypalClientsecret).toString("base64")
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    return data.access_token;
}
// -------------------------------------------