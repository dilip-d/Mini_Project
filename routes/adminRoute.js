const express = require('express')
const router = express.Router()
const adminauthController = require('../controllers/adminAuthController')
const productController = require('../controllers/productController')
const adminAuthMiddleware = require('../middleware/adminAuthmiddleware')
const userController = require('../controllers/userController')

router.get('/adminLogin', (req, res) => {
    console.log('Login page');
    res.render('admin/adminLogin', { layout: "./layouts/adminlayout.ejs", title: 'Login page', admin: false })
})

//admin user management
router.get('/userManage', adminAuthMiddleware.requireAdminAuth, userController.userManage_get)
router.get('/blockuser/:id', adminAuthMiddleware.requireAdminAuth, userController.blockUser)
router.get('/unblockuser/:id', adminAuthMiddleware.requireAdminAuth, userController.unblockUser)

//admin product handling
router.get('/addproduct', adminAuthMiddleware.requireAdminAuth, productController.addproduct_get)
router.post('/addproduct', adminAuthMiddleware.requireAdminAuth, productController.addproduct_post)
router.get('/viewproduct', adminAuthMiddleware.requireAdminAuth, productController.viewproduct_get)
router.get('/deleteproduct/:id', adminAuthMiddleware.requireAdminAuth, productController.deleteproduct)
router.get('/editproduct/:id', adminAuthMiddleware.requireAdminAuth, productController.editproduct_get)
router.post('/editproduct/:id', adminAuthMiddleware.requireAdminAuth, productController.editproduct_post)

//admin signup and login
router.get('/admin', adminAuthMiddleware.requireAdminAuth, adminauthController.adminHome_get)
router.get('/adminSignup', adminauthController.adminSignup_get)
router.post('/adminSignup', adminauthController.adminSignup_post);
router.get('/adminLogin', adminAuthMiddleware.requireAdminAuth, adminauthController.adminLogin_get);
router.post('/adminLogin', adminauthController.adminLogin_post);
router.get('/adminLogout', adminauthController.adminlogout_get);

//category management
router.get('/category-management', adminAuthMiddleware.requireAdminAuth, adminauthController.category)
router.post('/addCategory', adminAuthMiddleware.requireAdminAuth, adminauthController.addCategory)
router.get('/deleteCategory/:id', adminAuthMiddleware.requireAdminAuth, adminauthController.deleteCategory)

//order management
router.get('/viewOrder', adminAuthMiddleware.requireAdminAuth, adminauthController.viewOrder_get)
router.post('/adminUpdateOrder/:id', adminAuthMiddleware.requireAdminAuth, adminauthController.adminOrderStatus);

//Coupon management
router.get('/coupon', adminAuthMiddleware.requireAdminAuth, adminauthController.coupon_get)
router.post('/addCoupon', adminAuthMiddleware.requireAdminAuth, adminauthController.addCoupon)
router.get('/deleteCoupon/:id', adminAuthMiddleware.requireAdminAuth, adminauthController.deleteCoupon)

//banner management
router.get('/bannerManage', adminAuthMiddleware.requireAdminAuth, adminauthController.banner_get)
router.post('/addBanner', adminAuthMiddleware.requireAdminAuth, adminauthController.banner_post)
router.get('/deleteBanner/:id', adminAuthMiddleware.requireAdminAuth, adminauthController.deleteBanner)

module.exports = router;