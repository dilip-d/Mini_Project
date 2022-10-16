const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {handleErrors}  = require('../middleware/errHandlingMiddleware');
const {loginerrorhandler}  = require('../middleware/errHandlingMiddleware');
const {requireAuth,checkUser} = require('../middleware/authMiddleware')

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id}, 'the secret',{
        expiresIn: maxAge
    })
}

module.exports.homepage_get = (req,res)=>{
    res.render('./user/index',{layout:"./layouts/layout.ejs" , title:'home page'})
}

module.exports.userSignup_get = (req,res)=>{
    res.render('./user/userSignup.ejs',{title:'signup'});
}

module.exports.userSignup_post = async(req,res)=>{
    console.log('testing..');
       const {fname,lname,email,phonenumber,password} = req.body
    
    try{
    const user = await User.create({fname,lname,email,phonenumber,password});
         console.log('try to save data on db');
          const token = createToken(user._id);
            res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge * 1000});
            res.status(201).json({user});
            console.log(token);
            console.log(user);
            res.redirect('/');

    }catch(errors){
        console.log(errors);
        const errorHandler = handleErrors(errors);
        console.log(errorHandler);
        res.status(400).json({errorHandler});
        // res.redirect('/userSignup');
    }
}

module.exports.userLogin_get = (req,res)=>{
    res.render('./user/userLogin.ejs',{title:'login'});
}

module.exports.userLogin_post = async(req,res)=>{
console.log(req.body);
    const {email,password} = req.body;
  
      try {
        const user = await User.login(email,password);
        const token = createToken(user._id);
            res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge * 1000});
        res.status(200).json({user});
        console.log(user + "logged in");
     
    } catch (errors) {
        console.log(errors);
        // res.redirect("/userLogin");
        const errorHandle = loginerrorhandler(errors);
        res.status(400).json({errorHandle});
    }
}

module.exports.logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1 });
    res.redirect('/');
}