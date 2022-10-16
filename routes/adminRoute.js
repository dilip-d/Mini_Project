const express= require('express')
const router=express.Router()
const adminauthController = require('../controllers/adminauthController')

router.get('/adminLogin', (req,res)=>{
    console.log('Login page');
    res.render('admin/adminLogin',{layout:"./layouts/adminlayout.ejs" ,title:'Login page', admin : false})
})

router.get('/admin', (req,res)=>{
    console.log('admin page');
    res.render('admin/index',{layout:"./layouts/adminlayout.ejs" ,title:'admin home',admin:true})
})

router.get('/addproduct', (req,res)=>{
    res.render('admin/addproduct',{layout:"./layouts/adminlayout.ejs" ,title:'product management',admin:true})
})

router.get('/userManage', (req,res)=>{
    res.render('admin/userManage',{layout:"./layouts/adminlayout.ejs" ,title:'user management',admin:true})
})


router.get('/adminSignup',adminauthController.adminSignup_get)

router.post('/adminSignup',adminauthController.adminSignup_post);

router.get('/adminLogin',adminauthController.adminLogin_get);

router.post('/adminLogin',adminauthController.adminLogin_post);

router.get('/adminLogout',adminauthController.adminlogout_get); 

module.exports = router;