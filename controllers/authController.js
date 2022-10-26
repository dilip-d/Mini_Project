const User = require('../models/User');
const Product = require('../models/productSchema');
const jwt = require('jsonwebtoken');
const {handleErrors}  = require('../middleware/errHandlingMiddleware');
const {loginerrorhandler}  = require('../middleware/errHandlingMiddleware');
require('dotenv').config();
const client = require('twilio')(process.env.accountSid,process.env.authToken);

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id}, 'the secret',{
        expiresIn: maxAge
    })
}

module.exports.homepage_get = async(req,res)=>{
        console.log('find product for user');
        try{
            const products = await Product.find({});
            console.log('found');
            res.render('./user/index',{product : products ,layout:"./layouts/layout.ejs" , title:'home page',admin:false})
               
        }catch(err){
            res.status(500).json(err);
        }
    }

module.exports.userSignup_get = (req,res)=>{
    res.render('./user/userSignup.ejs',{title:'signup'});
}

module.exports.otpSignup_get = (req,res)=>{
    res.render('./user/otpSignup.ejs',{title:'OTP'})
}

module.exports.sendOtp = async(req,res)=>{
    console.log('hai sending otp');
    const data = req.body;
    console.log(data.phonenumber);
    await client.verify.services(process.env.serviceID)
    .verifications
    .create({to:`+91${req.body.phonenumber}`, channel:'sms'})
    .then(verification => console.log(verification.status))
    
    .catch(e=>{
        console.log('error catch');
        console.log(e);
        res.status(500).send(e);
    })
    console.log('verification send');
    res.sendStatus(200);
}

module.exports.otpVerification = async (req,res)=>{

    console.log('otpverificatin in');
    console.log(req.body);
    const check = await client.verify.services(process.env.serviceID)
    .verificationChecks
    .create({to:`+91${req.body.phonenumber}`,code : req.body.otp})
    .catch(e =>{
        console.log(e);
        res.status(500).send(e);
    })

    if(check.status === 'approved'){
        let email = req.body.email;
        await User.findOneAndUpdate({email:email},{isVerified:true});
    }
    res.status(200).json(check.status);
}

module.exports.userSignup_post = async(req,res)=>{
    console.log('Sign up post..');
                
    try{
        const {fname,lname,email,phonenumber,password} = req.body;
        const user = await User.create({fname,lname,email,phonenumber,password});
         console.log('try to save data on db');
            res.status(201).json({user});
            console.log(user);

    }catch(errors){
        console.log(errors);
        const errorHandler = handleErrors(errors);
        console.log(errorHandler);
        res.status(400).json({errorHandler});
    }
}

module.exports.userLogin_get = (req,res)=>{
    res.render('./user/userLogin.ejs',{title:'login'});
}

module.exports.userLogin_post = async(req,res)=>{
console.log(req.body);
      try {
        const {email,password} = req.body;
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge * 1000});
        res.status(200).json({user});
        console.log(user + "logged in");
     
    } catch (errors) {
        console.log(errors);
        const errorHandle = loginerrorhandler(errors);
        res.status(400).json({errorHandle});
    }
}

module.exports.logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1 });
    res.redirect('/');
}

module.exports.mensWatch_get = async(req,res)=>{
    console.log('find product for user');
    try{
        const products = await Product.find({});
        console.log('found');
        res.render('./user/mensWatch',{product : products ,layout:"./layouts/layout.ejs" , title:'Mens watch',admin:false})
           
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports.womensWatch_get = async(req,res)=>{
    console.log('find product for user');
    try{
        const products = await Product.find({});
        console.log('found');
        res.render('./user/womensWatch',{product : products ,layout:"./layouts/layout.ejs" , title:'Womens watch',admin:false})
           
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports.userCart_get = async(req,res)=>{
    console.log('in cart');
    try {
        let Curuser = req.user.id

        const users = await User.findById({ _id: Curuser })
        // console.log(users);
        const sum = function(items,p1,p2){
            return items.reduce(function (a,b){
                return parseInt(a)+(parseInt(b[p1])*parseInt(b[p2]))
            },0)
        }
        const total = sum(users.cart,'price','count')

        res.render('./user/cart.ejs', { user: users.cart, totals:total, layout:'./layouts/layout.ejs' ,title:'checkout', admin : false})

    } catch (err) {
        console.log(err);
    }
}

module.exports.addToCart_post = async (req, res) => {

    const id = req.body.id;
    // console.log(id);
    let userr = req.user.id
    // console.log(userr);
    
    let product = await Product.findById({ _id: id })
    product = product.toJSON()
    product.count = 1;

    const userid = await User.findById({ _id: userr })
    const checks = userid.cart;
    // console.log(checks);
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
        // console.log('in else block');
        res.redirect('back')
    }
}

module.exports.checkout_get = async (req, res) => {
    console.log('checkouttttt');

    try {
        let Curuser = req.user.id
        // console.log(Curuser);

        const users = await User.findById({ _id: Curuser })
        // console.log(users);
        const sum = function(items,p1,p2){
            return items.reduce(function (a,b){
                return parseInt(a)+(parseInt(b[p1])*parseInt(b[p2]))
            },0)
        }
        const total = sum(users.cart,'price','count')

        res.render('./user/checkout.ejs', { user: users.cart, totals:total, layout: './layout/layout.ejs' ,title:'checkout', admin : false})

    } catch (err) {
        console.log(err);
    }
}

module.exports.addToCart = async (req, res) => {

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

module.exports.removeFromCart = async (req, res) => {

    let prodId = req.params.id
    // console.log(prodId);
    let product = await Product.findById(prodId)
    // console.log(product);
    let userr = req.user.id
    // console.log(userr);

    const userid = await User.findById({ _id: userr })

    const checks = userid.cart;
    // console.log(checks);
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
        res.redirect('/userCart')
    }
}

//wishlist get/add/remove
module.exports.userWishlist_get = async(req,res)=>{
    console.log('in wishlist');
    try {
        let Curuser = req.user.id

        const users = await User.findById({ _id: Curuser })
        // console.log(users);
        const sum = function(items,p1,p2){
            return items.reduce(function (a,b){
                return parseInt(a)+(parseInt(b[p1])*parseInt(b[p2]))
            },0)
        }
        const total = sum(users.cart,'price','count')

        res.render('./user/wishlist.ejs', { user: users.cart, totals:total, layout:'./layouts/layout.ejs' ,title:'checkout', admin : false})

    } catch (err) {
        console.log(err);
    }
}

module.exports.addToWishlist_post = async (req, res) => {

    const id = req.body.id;
    // console.log(id);
    let userr = req.user.id
    // console.log(userr);
    
    let product = await Product.findById({ _id: id })
    product = product.toJSON()
    product.count = 1;

    const userid = await User.findById({ _id: userr })
    const checks = userid.cart;
    // console.log(checks);
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
        // console.log('in else block');
        res.redirect('back')
    }
}

module.exports.addToWishlist = async (req, res) => {

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

module.exports.removeFromWishlist = async (req, res) => {

    let prodId = req.params.id
    // console.log(prodId);
    let product = await Product.findById(prodId)
    // console.log(product);
    let userr = req.user.id
    // console.log(userr);

    const userid = await User.findById({ _id: userr })

    const checks = userid.cart;
    // console.log(checks);
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
        res.redirect('/userWishlist')
    }
}

module.exports.singleProductView_get = (req,res)=>{
    res.render('./user/singleProductView.ejs',{title:'Single Product View'})
}