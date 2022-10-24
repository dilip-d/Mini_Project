const jwt = require('jsonwebtoken');
const { adminHandleerror} = require('../middleware/adminErrMiddleware');
const { adminloginerrorhandler} =  require('../middleware/adminErrMiddleware');
const Admin = require('../models/admin');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id}, 'the topsecret',{
        expiresIn: maxAge
    })
}

module.exports.adminHome_get = (req,res)=>{
    console.log('admin home');
    res.render('admin/index',{layout:"./layouts/adminlayout.ejs" ,title:'admin home',admin : true})
}

module.exports.adminSignup_get = (req,res)=>{
    console.log('hai');
    res.render('admin/adminSignup',{layout:"./layouts/adminlayout.ejs" ,title:'Signup',admin : false})
}

module.exports.adminSignup_post = async(req,res)=>{
    console.log('testing..');
       const {username,password} = req.body
    
    try{
    const admin = await Admin.create({username,password});
         console.log('try to save data on db');
        //   const token = createToken(admin._id);
        //     // res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge * 1000});
        //     // res.status(201).json({admin});
            // console.log(token);
            res.redirect('/adminLogin');

    }catch(errors){
        console.log(errors);
        const errorHandler = adminHandleerror(errors);
        console.log(errorHandler);
        res.status(400).json({errorHandler});
    }
}

module.exports.adminLogin_get = (req,res)=>{
    res.render('admin/adminLogin',{layout:"./layouts/adminlayout.ejs" ,title:'Login',admin : false})
}

module.exports.adminLogin_post = async(req,res)=>{
    console.log(req.body);

        const {username,password} = req.body;
      
        try {
            const admin = await Admin.login(username,password);
            const token = createToken(admin._id);
            res.cookie('jwt2',token,{httpOnly: true , maxAge: maxAge * 1000});
            res.status(200).json({admin});
            console.log(admin + "logged in");

        } catch (adminerrors) {
            console.log(adminerrors);
            const adminerrorHandle = adminloginerrorhandler(adminerrors);
            res.status(400).json({adminerrorHandle});
        }
    }

module.exports.adminlogout_get = (req,res)=>{
        res.cookie('jwt2','',{maxAge:1 });
        res.redirect('/adminLogin');
    }
   
// category

module.exports.category =(req,res)=>{
    // Category.find()
    // .then((result)=>{
        res.render('admin/category',{layout:"./layouts/adminlayout.ejs" ,title:'category mng',admin : true})
    //     validation.category = false
    // }).catch((err)=>console.log(err))
}

// add-category

module.exports.cateman=(req,res)=>{
    newcat = req.body.category
    Category.findOne({category:newcat})
    .then((result)=>{
        if(result){
            validation.category = true
            res.redirect('/category-management')
        }else{
            let category = new Category({
                category : newcat
            })
            category.save()
            .then(()=>{
                res.redirect('/category-management')
            }).catch((err)=>{
                console.log(err)
            })   
        }
    })
}

// delete category

module.exports.deleteCategory = (req,res)=>{
    newcat = req.query.id
    // console.log(newcat)
    Category.deleteOne({_id:newcat})
    .then((result)=>{
        // console.log(result)
        res.redirect('/category-management')
    }).catch((err)=>{
        console.log(err)
    })
}