const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

//get home page
router.get('/', authMiddleware.checkUser, authController.homepage_get)

router.get('/userSignup', authController.userSignup_get);
router.post('/userSignup', authController.userSignup_post);
router.post('/sendnotification', authController.sendOtp);
router.post('/verify-otp', authController.otpVerification);
router.get('/userLogin', authMiddleware.requireAuth);
router.post('/userLogin', authController.userLogin_post);
router.get('/logout', authController.logout_get);
router.get('/otpSignup', authController.otpSignup_get);

//pages and views
router.get('/mensWatch', authController.mensWatch_get);
router.get('/womensWatch', authController.womensWatch_get);
router.get('/singleProductView', authController.singleProductView_get);

//cart
router.get('/userCart', authMiddleware.requireAuth, authController.userCart_get);
router.post('/addToCart', authMiddleware.requireAuth, authController.addToCart_post);
router.get('/removeFromcart/:id', authController.removeFromCart);
router.get('/decrementCartCount/:id', authController.decrementCartCount);
router.get('/incrementCartCount/:id', authController.incrementCartCount);

//wishlist
router.get('/userWishlist', authController.userWishlist_get);
router.post('/addToWishlist', authMiddleware.requireAuth, authController.addToWishlist_post);
router.get('/removeFromWishlist/:id', authController.removeFromWishlist);
router.get('/addtoWishlist/:id', authMiddleware.requireAuth, authController.addToWishlist);
router.get('/moveToCart/:id', authController.moveToCart);

//user side profile management
router.get('/userProfile', authMiddleware.requireAuth, authController.userProfile_get);
router.get('/editProfile', authController.editProfile_get);
router.post('/editProfile/:id', authController.editProfile_post);
router.get('/addAddress', authController.addAddress);
router.post('/addAddress/:id', authController.addAddress_post);

//checkout and order details
router.get('/checkout', authController.checkout_get);
router.post('/checkout', authController.checkout_post);
router.get('/saveOrder', authController.saveOrder);
router.get('/orderStatus', authController.orderStatus_get);

//orderdetails
router.get('/orderDetails', authController.orderDetails_get);
router.get('/cancelOrder/:id', authController.cancelOrder);
router.get('/returnOrder/:id', authController.returnOrder);

//razorpay
router.post('/verifyPaymentRazorpay', authController.verifyPaymentRazorpay);

//paypal
router.post('/paymentPaypal', authController.paymentPaypal);
router.post('/verifyPaymentPaypal/:id/capture', authController.verifyPaymentPaypal);

//coupon
router.post('/applyCoupon', authController.applyCoupon_post);

module.exports = router;