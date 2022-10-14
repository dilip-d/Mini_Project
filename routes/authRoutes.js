// // const {Router} = require('express');
// // const authController = require('../controllers/authController')

// // const router = Router();

// // //router.get('/userSignup',,authController.userSignup_get);
// // router.post('/userSignup',authController.userSignup_post);
// // router.get('/userLogin',authController.userLogin_get);
// // router.get('/userLogin',authController.userLogin_post);

// // module.exports = router;

// const isLogin = async(req,res,next)=>{
//     try{
//         if(req.session.user_id){
//         }
//         else{
//           res.redirect('/userLogin') ;  
//         }
//         next();

//     }catch(error){
//         console.log(error.message);

//     }
// } 

// const isLogout = async(req,res,next)=>{
//     try{
//         if(req.session.user_id){
//             res.redirect('/userLogin');
//         }
//         next();

//     }catch(error){
//         console.log(error.message);

//     }
// } 
// module.exports = {
//     isLogin,
//     isLogout
// }