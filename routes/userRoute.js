const express= require('express')
const router=express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

//get home page
router.get('/', authMiddleware.checkUser,authController.homepage_get)

router.get('/userSignup',authMiddleware.requireAuth,authController.userSignup_get);

router.post('/userSignup',authController.userSignup_post,authController.homepage_get);

router.get('/userLogin',authMiddleware.requireAuth,authController.userLogin_get);

router.post('/userLogin',authController.userLogin_post);

router.get('/logout',authController.logout_get);

module.exports = router;