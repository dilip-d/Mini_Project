const Product = require('../models/productSchema');
const Category = require('../models/categorySchema');
const jwt = require('jsonwebtoken');

module.exports.addproduct_get= (req,res)=>{
    console.log('add product');
    Category.find().then((category) => {
    res.render('admin/addproduct',{result: '', category,layout:"./layouts/adminlayout.ejs" ,title:'add product',admin:true})
    })
}

module.exports.addproduct_post = async (req,res) =>{
    console.log(req.body);
    const name = req.body.name;
    const category= req.body.category;
    const price = req.body.price;
    const description = req.body.description;
    const stock = req.body.stock;

    const product = await Product.create({name,category,price,description,stock});
    try{
       let image = req.files.image;
       image.mv('./public/image/'+product._id+".jpeg");
        // res.status(200).json()
        res.redirect('/addproduct');
    }
    catch (err){
        console.log(err);
    }
}

//get product
module.exports.viewproduct_get= async (req,res)=>{
    console.log('find product');
    try{
        const products = await Product.find({});
        console.log('found');
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
   try{
     console.log('edit product get');
    const proId = req.params.id
    const products = await Product.findById(proId)
    res.render('admin/editproduct',{ product :products,layout:"./layouts/adminlayout.ejs" ,title:'edit product',admin:true})
}catch(err){
    console.log(err);
}
}

module.exports.editproduct_post = async (req,res)=>{
    const proId = req.params.id
    console.log('edit product post');
    try{
        await Product.updateOne({_id:proId},{
            
            $set:{
                name : req.body.name,
                category : req.body.category,
                price : req.body.price,
                description : req.body.description,
                stock : req.body.stock,
                image : req.body.image,
            }
            
        })
        console.log('dfdfsds');
        res.redirect('/viewproduct');
       
    }catch(err){
        console.log(err);
    }
}

