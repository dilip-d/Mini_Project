const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app= express()
// const router=express.Router()
const cookieParser = require('cookie-parser')
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const nocache = require('nocache');
// const session = require('express-session');
const { checkUser } = require('./middleware/authMiddleware');
// require('dotenv').config();

app.set('layout','./layouts/layout.ejs','./layouts/adminlayout.ejs');
// app.set('adminlayout','./layouts/adminlayout')
//set templating engine
app.set('view engine','ejs')
    
//static files 
app.use(express.static('public'))
app.use(expressLayouts)
app.use(nocache())
 
app.use(cookieParser())
app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.use('/',userRoute)
app.use('/',adminRoute)
// app.use('*',checkUser);

app.use(function (req, res, next) {
    res.status(404).send("<h1>Sorry can't find that!</h1>");
  });
 
//const port = process.env.PORT || 3000
app.listen(3000, (req,res)=>{
    console.log('app is listening on port 3000');
})

