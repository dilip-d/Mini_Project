const jwt = require('jsonwebtoken');
const { adminHandleerror } = require('../middleware/adminErrMiddleware');
const { adminloginerrorhandler } = require('../middleware/adminErrMiddleware');
const Admin = require('../models/admin');
const Category = require('../models/categorySchema');
const User = require('../models/User');
const Product = require('../models/productSchema');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'the topsecret', {
        expiresIn: maxAge
    })
}

module.exports.adminHome_get = (req, res) => {
    console.log('admin home');
    res.render('admin/index', { layout: "./layouts/adminlayout.ejs", title: 'admin home', admin: true })
}

module.exports.adminSignup_get = (req, res) => {
    console.log('hai');
    res.render('admin/adminSignup', { layout: "./layouts/adminlayout.ejs", title: 'Signup', admin: false })
}

module.exports.adminSignup_post = async (req, res) => {
    console.log('testing..');
    const { username, password } = req.body

    try {
        const admin = await Admin.create({ username, password });
        console.log('try to save data on db');
        //   const token = createToken(admin._id);
        //     // res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge * 1000});
        //     // res.status(201).json({admin});
        // console.log(token);
        res.redirect('/adminLogin');

    } catch (errors) {
        console.log(errors);
        const errorHandler = adminHandleerror(errors);
        console.log(errorHandler);
        res.status(400).json({ errorHandler });
    }
}

module.exports.adminLogin_get = (req, res) => {
    res.render('admin/adminLogin', { layout: "./layouts/adminlayout.ejs", title: 'Login', admin: false })
}

module.exports.adminLogin_post = async (req, res) => {
    console.log(req.body);

    const { username, password } = req.body;

    try {
        const admin = await Admin.login(username, password);
        const token = createToken(admin._id);
        res.cookie('jwt2', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ admin });
        console.log(admin + "logged in");

    } catch (adminerrors) {
        console.log(adminerrors);
        const adminerrorHandle = adminloginerrorhandler(adminerrors);
        res.status(400).json({ adminerrorHandle });
    }
}

module.exports.adminlogout_get = (req, res) => {
    res.cookie('jwt2', '', { maxAge: 1 });
    res.redirect('/adminLogin');
}

// category
module.exports.category = (req, res) => {
    Category.find()
        .then((result) => {
            res.render('admin/category', { result, layout: 'layouts/adminlayout', title: 'Category', admin: true })
        }).catch((err) => console.log(err))
}

module.exports.addCategory = async (req, res) => {

    try {
        let category = req.body.category
        const cat = await Category.create({ category })
        res.redirect('/category-management')

    } catch (err) {
        console.log(err);
    }
}

module.exports.deleteCategory = (req, res) => {
    newcat = req.query.id
    Category.deleteOne({ _id: newcat })
        .then((result) => {
            res.redirect('/category-management')
        }).catch((err) => {
            console.log(err)
        })
}

// banner
module.exports.banner_get = (req, res) => {
    res.render('admin/bannerManage', { layout: 'layouts/adminlayout', title: 'Banner', admin: true })
}

// module.exports.viewOrder_get = (req,res)=>{
//     console.log('order view');
//     res.render('admin/viewOrder',{ layout:'layouts/adminlayout',title:'Orders', admin: true })
// }

module.exports.viewOrder_get = async (req, res) => {

    const result = await User.find({})
    // console.log(result)

    let orders = []
    for (item of result) {
        orders = orders.concat(item.order)
    }
    console.log(orders);
    // const ans = orders.reverse()
    // orders.sort((a, b) => {
    //     return b.createdAt - a.createdAt;
    // });
    console.log(orders);

    res.render('admin/viewOrder', { order: orders, layout: 'layouts/adminlayout', title: 'Orders', admin: true })

}

module.exports.adminCancelOrder = async (req, res) => {

    console.log('cancelling in order');
    const user = req.user.id;
    // console.log(user);
    uniqueId = req.params.id;
    console.log(uniqueId);
    if (user) {
        console.log('after unique iddddddd');
        User.findOne({ user: uniqueId })
            .then((result) => {
                // console.log(result)

                const orders = result.order
                console.log(orders)

                for (let order of orders) {
                    order = order.toJSON();
                    console.log('order of orders');
                    if (order.unique === uniqueId) {
                        console.log('going for update');
                        Promise.all([(User.updateOne({ "_id": user, "order.unique": uniqueId }, { $set: { "order.$.orderStatus": "Order cancelled" } })), (Product.updateOne({ "_id": order._id }, { $inc: { "stock": order.count } }))])
                            .then((result) => {
                                res.redirect('/viewOrder')
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                }
            })
        //     } else {
        //         res.redirect('/admin')
    }
}