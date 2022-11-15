const Product = require('../models/productSchema');
const Category = require('../models/categorySchema');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports.addproduct_get = (req, res) => {
    console.log('add product');
    Category.find().then((category) => {
        res.render('admin/addproduct', { result: '', category, layout: "./layouts/adminlayout.ejs", title: 'add product', admin: true })
    })
}

module.exports.addproduct_post = async (req, res) => {

    console.log(req.body);
    const name = req.body.name;
    const category = req.body.category;
    const originalPrice = req.body.originalPrice;
    const discount = req.body.originalPrice / 100 * req.body.offer;
    const pricebefore = req.body.originalPrice - discount;
    const price = pricebefore.toFixed();
    const offer = req.body.offer;
    const description = req.body.description;
    const stock = req.body.stock;

    console.log(discount);
    console.log(price);
    console.log(offer);
    console.log(originalPrice);

    const product = await Product.create({ name, category, price, originalPrice, offer, description, stock });
    try {
        let image = req.files.image;
        image.mv('./public/image/' + product._id + ".jpeg");
        let image1 = req.files.image1;
        image1.mv('./public/image/' + product._id + "1.jpeg");
        let image2 = req.files.image2;
        image2.mv('./public/image/' + product._id + "2.jpeg");
        let image3 = req.files.image3;
        image3.mv('./public/image/' + product._id + "3.jpeg");

        res.redirect('/addproduct');
    }
    catch (err) {
        console.log(err);
    }
}

//get product
module.exports.viewproduct_get = async (req, res) => {
    console.log('find product');
    try {
        const products = await Product.find({});
        console.log('found');
        res.render('admin/viewproduct', { product: products, layout: "./layouts/adminlayout.ejs", title: 'view product', admin: true })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.deleteproduct = async (req, res) => {
    const productId = req.params.id
    console.log(productId);
    try {
        const result = await Product.deleteOne({ _id: productId });
        console.log('deletion success');
        res.redirect('/viewproduct');
    } catch (err) {
        console.log(err);
    }
}

module.exports.editproduct_get = async (req, res) => {
    try {
        console.log('edit product get');
        const proId = req.params.id
        const products = await Product.findById(proId)
        res.render('admin/editproduct', { product: products, layout: "./layouts/adminlayout.ejs", title: 'edit product', admin: true })
    } catch (err) {
        console.log(err);
    }
}

module.exports.editproduct_post = async (req, res) => {
    const proId = req.params.id
    console.log('edit product post');
    console.log(req.body);
    const discount = req.body.originalPrice / 100 * req.body.offer;
    const pricebefore = req.body.originalPrice - discount;
    const price = pricebefore.toFixed();

    try {
        await Product.updateOne({ _id: proId }, {

            $set: {
                name: req.body.name,
                category: req.body.category,
                price: price,
                originalPrice: req.body.originalPrice,
                offer: req.body.offer,
                description: req.body.description,
                stock: req.body.stock,
                image: req.body.image,
            }
        })
    } catch (err) {
        console.log(err);
    }

    //--------------------------------
    try {
        const results = await User.find({})
        for (result of results) {
            carts = result.cart
            for (let cart of carts) {
                cartId = "" + cart._id
                if (cartId === proId) {
                    result2 = await User.updateOne({ "_id": result._id, "cart._id": proId }, { $set: { "cart.$.price": price } })
                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }
    //-----------------------------------

    //--------------------------------
    try {
        const results = await User.find({})
        for (result of results) {
            wishlists = result.wishlist
            for (let wishlist of wishlists) {
                wishlistId = "" + wishlist._id
                if (wishlistId === proId) {
                    result2 = await User.updateOne({ "_id": result._id, "wishlist._id": proId }, { $set: { "wishlist.$.price": price } })
                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }
    res.redirect('/viewproduct');
    //-----------------------------------
}

