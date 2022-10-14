const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app= express()
const cookieParser = require('cookie-parser')
// const nocache = require('nocache');
// const session = require('express-session');
const { checkUser } = require('./middleware/authMiddleware');
// require('dotenv').config();

app.set('layout','./layouts/layout')

//set templating engine
app.set('view engine','ejs')
    
//static files 
app.use(express.static('public')) 
app.use(expressLayouts)
 
app.use(cookieParser())
app.use(express.urlencoded({extended : false}));
app.use(express.json());

// app.use(
//   session({
//   secret : 'this is top secret',
//   resave : false,
//   saveUninitialized : false,
//   // cookie : {
//   //     maxAge :  86400000
//   // }
//   })
// )

// app.use((req,res,next)=>{
//   if(!req.session.user && req.cookies.id){
//       res.clearCookie(req.cookies.id)
//     req.session.isLoggedIn = false;
//   next();}
//   }
//   )
app.get('*',checkUser);
app.use('/',require('./routes/userRoute'))

app.use(function (req, res, next) {
    res.status(404).send("<h1>Sorry can't find that!</h1>");
  });
 
//const port = process.env.PORT || 3000
app.listen(3000, (req,res)=>{
    console.log('app is listening on port 3000');
})

