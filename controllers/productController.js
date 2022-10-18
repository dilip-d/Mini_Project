const Product = require('../models/productSchema');
const jwt = require('jsonwebtoken');

module.exports.addproduct_get= (req,res)=>{
    console.log('add product');
    res.render('admin/addproduct',{layout:"./layouts/adminlayout.ejs" ,title:'add product',admin:true})
}

module.exports.viewproduct_get= (req,res)=>{
    console.log('view product');
    res.render('admin/viewproduct',{layout:"./layouts/adminlayout.ejs" ,title:'view product',admin:true})
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

module.exports.findproduct_get= async (req,res)=>{
    console.log('find product');
    try{
        const products = await Product.find({});
        console.log('found');
        // res.redirect('/viewproduct')
        res.render('admin/viewproduct',{product : products , layout:"./layouts/adminlayout.ejs" ,title:'view product',admin:true})
           
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports.deleteproduct = async(req,res)=>{
    const productId = req.params.id
    console.log(productId);
    try{
        const result = await Product.deleteOne({_id : productId});
        console.log('deletion success');
        res.redirect('/viewproduct');
    }catch(err){
        console.log(err);
    }
}
module.exports.editproduct_get = async (req,res)=>{
    console.log('edit product get');
    res.render('admin/editproduct',{ layout:"./layouts/adminlayout.ejs" ,title:'edit product',admin:true})
}

module.exports.editproduct_post = async (req,res)=>{
    console.log('edit product post');
    
    res.render('admin/editproduct',{ layout:"./layouts/adminlayout.ejs" ,title:'edit product',admin:true})
}
