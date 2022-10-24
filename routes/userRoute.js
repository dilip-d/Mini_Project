const express= require('express')
const router=express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

//get home page
router.get('/', authMiddleware.checkUser,authController.homepage_get)

router.get('/userSignup',authController.userSignup_get);
router.post('/userSignup',authController.userSignup_post);
router.post('/sendnotification',authController.sendOtp);
router.post('/verify-otp',authController.otpVerification);
router.get('/userLogin',authMiddleware.requireAuth,authController.userLogin_get);
router.post('/userLogin',authController.userLogin_post);
router.get('/logout',authController.logout_get);

router.get('/otpSignup',authController.otpSignup_get);

router.get('/userCart',authController.userCart_get);

router.post('/addToCart',authController.addToCart_post);

router.get('/singleProductView',authController.singleProductView_get);

router.get('/userPayment',authController.userPayment_get);

router.get('/mensWatch',authController.mensWatch_get);

router.get('/womensWatch',authController.womensWatch_get);

module.exports = router;