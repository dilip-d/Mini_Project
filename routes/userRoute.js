const express= require('express')
const router=express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

//get home page
router.get('/', (req,res)=>{
    res.render('index',{title:'home page'})
})

router.route('/userSignup')
.get(authController.userSignup_get).post(authController.userSignup_post);

router.get('/userLogin',authMiddleware.requireAuth,authController.userLogin_get);

router.post('/userLogin',authController.userLogin_post);

router.route('/logout')
.get(authController.logout_get);

module.exports = router;