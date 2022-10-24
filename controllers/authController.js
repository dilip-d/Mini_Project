const User = require('../models/User');
const Product = require('../models/productSchema');
const Cart = require('../models/cartSchema');
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

module.exports.userCart_get = (req,res)=>{
    res.render('./user/cart.ejs',{title:'cart'})
}

module.exports.addToCart_post = async(req,res)=>{
    console.log('adding to cart');
    const id = req.body.id;
    console.log(id);
    try{
        const cart = new Cart({
            name:req.body._id,  
        })
        const cartData = await cart.save();
        res.status(200).send({success:true})
    }catch(err){
        res.status(400).send({success:false, msg:err.message})
    }
}

module.exports.singleProductView_get = (req,res)=>{
    res.render('./user/singleProductView.ejs',{title:'Single Product View'})
}

module.exports.userPayment_get = (req,res)=>{
    res.render('./user/payment.ejs',{title:'Payment'})
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