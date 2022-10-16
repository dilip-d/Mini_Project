const Product = require('../models/productSchema');
const jwt = require('jsonwebtoken');

module.exports.productManage_get= (req,res)=>{
    res.render('admin/addproduct',{layout:"./layouts/adminlayout.ejs" ,title:'product management',admin:true})
}

// module.exports.addproduct_post= (req,res)=>{
//     try{
//         const product = await Product.create(req.body)
//         res.status(200).json
//     }
// }