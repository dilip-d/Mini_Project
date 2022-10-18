const express= require('express')
const router=express.Router()
const adminauthController = require('../controllers/adminauthController')
const productController = require('../controllers/productController')
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware')
const userController = require('../controllers/userController')

router.get('/adminLogin', (req,res)=>{
    console.log('Login page');
    res.render('admin/adminLogin',{layout:"./layouts/adminlayout.ejs" ,title:'Login page', admin : false})
})

// router.get('/admin', (req,res)=>{
//     console.log('admin page');
//     res.render('admin/index',{layout:"./layouts/adminlayout.ejs" ,title:'admin home',admin:true})
// })
// router.get('/userManage', (req,res)=>{
//     res.render('admin/userManage',{layout:"./layouts/adminlayout.ejs" ,title:'user management',admin:true})
// })

//admin user management
router.get('/userManage',userController.userManage_get)
router.get('/blockuser/:id',userController.blockUser)
router.get('/unblockuser/:id',userController.unblockUser)

//admin product handling
router.get('/addproduct',productController.addproduct_get)
router.post('/addproduct',productController.addproduct_post)
router.get('/viewproduct',productController.viewproduct_get)
router.get('/deleteproduct/:id',productController.deleteproduct)
router.get('/editproduct/:id',productController.editproduct_get)
router.post('/editproduct/:id',productController.editproduct_post)

//admin signup and login
router.get('/admin',adminAuthMiddleware.checkAdmin,adminauthController.adminHome_get)
router.get('/adminSignup',adminauthController.adminSignup_get)
router.post('/adminSignup',adminauthController.adminSignup_post);
router.get('/adminLogin',adminAuthMiddleware.requireAdminAuth,adminauthController.adminLogin_get);
router.post('/adminLogin',adminauthController.adminLogin_post);
router.get('/adminLogout',adminauthController.adminlogout_get); 

module.exports = router;