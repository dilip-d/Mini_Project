const express = require('express')
const router = express.Router()
const adminauthController = require('../controllers/adminauthController')
const productController = require('../controllers/productController')
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware')
const userController = require('../controllers/userController')

router.get('/adminLogin', (req, res) => {
    console.log('Login page');
    res.render('admin/adminLogin', { layout: "./layouts/adminlayout.ejs", title: 'Login page', admin: false })
})

//admin user management
router.get('/userManage', userController.userManage_get)
router.get('/blockuser/:id', userController.blockUser)
router.get('/unblockuser/:id', userController.unblockUser)

//admin product handling
router.get('/addproduct', productController.addproduct_get)
router.post('/addproduct', productController.addproduct_post)
router.get('/viewproduct', productController.viewproduct_get)
router.get('/deleteproduct/:id', productController.deleteproduct)
router.get('/editproduct/:id', productController.editproduct_get)
router.post('/editproduct/:id', productController.editproduct_post)

//admin signup and login
router.get('/admin', adminAuthMiddleware.requireAdminAuth, adminauthController.adminHome_get)
router.get('/adminSignup', adminauthController.adminSignup_get)
router.post('/adminSignup', adminauthController.adminSignup_post);
router.get('/adminLogin', adminAuthMiddleware.requireAdminAuth, adminauthController.adminLogin_get);
router.post('/adminLogin', adminauthController.adminLogin_post);
router.get('/adminLogout', adminauthController.adminlogout_get);

//category management
router.get('/category-management', adminauthController.category)
router.post('/admin-panel/category', adminauthController.addCategory)
router.post('/admin/delete-category', adminauthController.deleteCategory)

//order management
router.get('/viewOrder', adminauthController.viewOrder_get)
router.post('/adminUpdateOrder/:id', adminauthController.adminOrderStatus);

//Coupon management
router.get('/coupon', adminauthController.coupon_get)
router.post('/addCoupon',adminauthController.addCoupon)
router.post('/deleteCoupon',adminauthController.deleteCoupon)

//banner management
router.get('/bannerManage', adminauthController.banner_get)
router.post('/addBanner', adminauthController.banner_post)
router.post('/admin/delete-banner',adminauthController.deleteBanner)
module.exports = router;