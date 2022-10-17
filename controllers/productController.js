const Product = require('../models/productSchema');
const jwt = require('jsonwebtoken');

module.exports.productManage_get= (req,res)=>{
    console.log('product manage');
    res.render('admin/addproduct',{layout:"./layouts/adminlayout.ejs" ,title:'product management',admin:true})
}

module.exports.addproduct_post = async (req,res) =>{
    console.log(req.body);
    try{
        const product = await Product.create(req.body)
        console.log(product);
        // res.status(200).json()
        res.redirect('/addproduct');
    }
    catch (err){
        console.log(err);
    }
}

//get product

// module.exports.findproduct_get= async (req,res)=>{
//     console.log('find product');
//     try{
//         const products = await Product.find({});
//         console.log(products);
//         res.render('admin/addproduct',{product : products , layout:"./layouts/adminlayout.ejs" ,title:'product management',admin:true})
           
//     }catch(err){
//         res.status(500).json(err);
//     }
// }