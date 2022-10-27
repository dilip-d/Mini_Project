const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app= express()
const cookieParser = require('cookie-parser')
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const nocache = require('nocache');
const fileUpload = require('express-fileupload')
const { checkUser } = require('./middleware/authMiddleware');

app.set('layout','./layouts/layout.ejs','./layouts/adminlayout.ejs');
//set templating engine
app.set('view engine','ejs')
    
//static files 
app.use(express.static('public'))
app.use(expressLayouts)
app.use(nocache())
 
app.use(cookieParser())
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(fileUpload())

app.use('*',checkUser);
app.use('/',userRoute)
app.use('/',adminRoute)

app.use(function (req, res, next) {
    res.status(404).send("<h1>Sorry can't find that!</h1>");
  });
 
//const port = process.env.PORT || 3000
app.listen(3000, (req,res)=>{
    console.log('app is listening on port 3000');
})