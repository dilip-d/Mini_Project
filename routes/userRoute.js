const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

//get home page
router.get('/', authMiddleware.checkUser, authController.homepage_get)

//Signup and login
router.get('/userSignup', authController.userSignup_get);
router.post('/userSignup', authController.userSignup_post);
router.post('/sendnotification', authController.sendOtp);
router.post('/verify-otp', authController.otpVerification);
router.get('/userLogin', authMiddleware.requireAuth, authController.userLogin_get);
router.post('/userLogin', authController.userLogin_post);
router.get('/logout', authController.logout_get);
router.get('/otpSignup', authController.otpSignup_get);

//pages and views
router.get('/mensWatch', authController.mensWatch_get);
router.get('/womensWatch', authController.womensWatch_get);
router.get('/singleProductView', authController.singleProductView_get);

//cart
router.get('/userCart', authMiddleware.requireAuth, authController.userCart_get);
// router.post('/addToCart', authMiddleware.requireAuth, authController.addToCart_post);
router.get('/removeFromcart/:id', authMiddleware.requireAuth, authController.removeFromCart);
router.get('/incrementCartCount/:id', authMiddleware.requireAuth, authController.incrementCartCount);
router.get('/decrementCartCount/:id', authMiddleware.requireAuth, authController.decrementCartCount);

//wishlist
router.get('/userWishlist', authMiddleware.requireAuth, authController.userWishlist_get);
// router.post('/addToWishlist', authMiddleware.requireAuth, authController.addToWishlist_post);
router.get('/removeFromWishlist/:id', authMiddleware.requireAuth, authController.removeFromWishlist);
router.get('/addToWishlist/:id', authMiddleware.requireAuth, authController.addToWishlist);
router.get('/moveToCart/:id', authMiddleware.requireAuth, authController.moveToCart);

//user side profile management
router.get('/userProfile', authMiddleware.requireAuth, authController.userProfile_get);
router.get('/editProfile', authMiddleware.requireAuth, authController.editProfile_get);
router.post('/editProfile/:id', authMiddleware.requireAuth, authController.editProfile_post);
router.get('/addAddress', authMiddleware.requireAuth, authController.addAddress);
router.post('/addAddress/:id', authMiddleware.requireAuth, authController.addAddress_post);
router.get('/editAddress', authMiddleware.requireAuth, authController.editAddress_get);
router.post('/editAddress/:id', authMiddleware.requireAuth, authController.editAddress_post);
router.get('/deleteAddress/:id', authMiddleware.requireAuth, authController.deleteAddress);

//checkout and order details
router.get('/checkout', authMiddleware.requireAuth, authController.checkout_get);
router.post('/checkout', authMiddleware.requireAuth, authController.checkout_post);
router.get('/saveOrder', authMiddleware.requireAuth, authController.saveOrder);
router.get('/orderStatus', authMiddleware.requireAuth, authController.orderStatus_get);

//orderdetails
router.get('/orderDetails', authMiddleware.requireAuth, authController.orderDetails_get);
router.get('/cancelOrder/:id', authMiddleware.requireAuth, authController.cancelOrder);
router.get('/returnOrder/:id', authMiddleware.requireAuth, authController.returnOrder);

//razorpay
router.post('/verifyPaymentRazorpay', authMiddleware.requireAuth, authController.verifyPaymentRazorpay);

//paypal
router.post('/paymentPaypal', authMiddleware.requireAuth, authController.paymentPaypal);
router.post('/verifyPaymentPaypal/:id/capture', authMiddleware.requireAuth, authController.verifyPaymentPaypal);

//coupon
router.post('/applyCoupon', authMiddleware.requireAuth, authController.applyCoupon_post);

module.exports = router;