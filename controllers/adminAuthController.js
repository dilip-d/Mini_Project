const jwt = require('jsonwebtoken');
const { adminHandleerror} = require('../middleware/adminErrMiddleware');
const { adminloginerrorhandler} =  require('../middleware/adminErrMiddleware');
const Admin = require('../models/admin');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id}, 'the topsecret',{
        expiresIn: maxAge
    })
}

module.exports.adminHome_get = (req,res)=>{
    console.log('admin home');
    res.render('admin/index',{layout:"./layouts/adminlayout.ejs" ,title:'admin home',admin : true})
}

module.exports.adminSignup_get = (req,res)=>{
    console.log('hai');
    res.render('admin/adminSignup',{layout:"./layouts/adminlayout.ejs" ,title:'Signup',admin : false})
}

module.exports.adminSignup_post = async(req,res)=>{
    console.log('testing..');
       const {username,password} = req.body
    
    try{
    const admin = await Admin.create({username,password});
         console.log('try to save data on db');
        //   const token = createToken(admin._id);
        //     // res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge * 1000});
        //     // res.status(201).json({admin});
            // console.log(token);
            res.redirect('/adminLogin');

    }catch(errors){
        console.log(errors);
        const errorHandler = adminHandleerror(errors);
        console.log(errorHandler);
        res.status(400).json({errorHandler});
        // res.redirect('/userSignup');
    }
}

module.exports.adminLogin_get = (req,res)=>{
    res.render('admin/adminLogin',{layout:"./layouts/adminlayout.ejs" ,title:'Login',admin : false})
}

module.exports.adminLogin_post = async(req,res)=>{
    console.log(req.body);

        const {username,password} = req.body;
      
        try {
            const admin = await Admin.login(username,password);
            const token = createToken(admin._id);
            res.cookie('jwt2',token,{httpOnly: true , maxAge: maxAge * 1000});
            res.status(200).json({admin});
            console.log(admin + "logged in");

        } catch (adminerrors) {
            console.log(adminerrors);
            // res.redirect("/adminLogin");
            const adminerrorHandle = adminloginerrorhandler(adminerrors);
            res.status(400).json({adminerrorHandle});
        }
    }

module.exports.adminlogout_get = (req,res)=>{
        res.cookie('jwt2','',{maxAge:1 });
        res.redirect('/adminLogin');
    }
   