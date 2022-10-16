const express= require('express')
const router=express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const {requireAuth,checkUser} = require('../middleware/authMiddleware')

//get home page
router.get('/', (req,res)=>{
    res.render('./user/index',{layout:"./layouts/layout.ejs" , title:'home page'})
})

router.get('/userSignup',authController.userSignup_get);

router.post('/userSignup',authController.userSignup_post);

router.get('/userLogin',authMiddleware.requireAuth,authController.userLogin_get);

router.post('/userLogin',authController.userLogin_post);

router.get('/logout',authController.logout_get);

module.exports = router;