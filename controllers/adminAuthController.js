const jwt = require('jsonwebtoken');
const { adminHandleerror } = require('../middleware/adminErrMiddleware');
const { adminloginerrorhandler } = require('../middleware/adminErrMiddleware');
const Admin = require('../models/admin');
const Category = require('../models/categorySchema');
const User = require('../models/User');
const Product = require('../models/productSchema');
const Coupon = require("../models/couponSchema");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'the topsecret', {
        expiresIn: maxAge
    })
}

let validation = {
    category: false
}

module.exports.adminHome_get = async (req, res) => {

    const user = await User.count()
    const productCount = await Product.count()

    let Sales = await Product.aggregate([{ $group: { _id: null, sum_val: { $sum: "$sales" } } }])
    let totalSales = (Sales[0].sum_val);
    //  console.log(totalSales);

    const sales = [];
    const timeOfSale = [];
    let k = 0;
    let l = 0;
    let m = [];
    let n;

    await User.find({})
        .then((results) => {
            // console.log(result)
            let sums;
            n = results.length;
            console.log(`n:${n}`);

            for (result of results) {
                k++;
                console.log(`k:${k}`);
                const orders = result.order
                m.push(orders.length);
                console.log(`m:${m}`);

                console.log(`sums:${sums}`)

                for (let order of orders) {
                    l++;
                    console.log(`l:${l}`);
                    sums = m.reduce((partialSum, a) => partialSum + a, 0);
                    order = order.toJSON();

                    if (order.orderStatus !== "Order cancelled") {
                        console.log(order.count);
                        console.log(order.price);
                        sales.push(order.count * order.price);
                        console.log(sales);
                        timeOfSale.push(order.createdAt.toISOString().substring(0, 10));
                        console.log(timeOfSale);
                    }
                }
                if (l === sums && k === n) {

                    console.log(sales);
                    console.log(typeof (sales[0]));

                    console.log(timeOfSale);
                    console.log(typeof (timeOfSale[0]));
                    Product.find({})
                        .then((result) => {
                            const sum = function (items, prop1, prop2) {
                                return items.reduce(function (a, b) {
                                    return parseInt(a) + (parseInt(b[prop1]) * parseInt(b[prop2]));
                                }, 0);
                            };

                            const total = sum(result, 'price', 'sales');
                            console.log(total);

                            res.render('admin/index', { productCount, result, total: total, sales, timeOfSale, totalSales, user, layout: './layouts/adminlayout.ejs', title: 'Admin', admin: true })
                        }).catch((err) => {
                            console.log(err)
                        })
                }
            }
        })
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
            res.render('admin/category', { result, validation, layout: 'layouts/adminlayout', title: 'Category', admin: true })
            validation.category = false
        }).catch((err) => console.log(err))
}

module.exports.addCategory = async (req, res) => {
    let newcat = req.body.category
    Category.findOne({ category: newcat })
        .then((result) => {
            if (result) {
                validation.category = true
                res.redirect('/category-management')
            } else {
                let category = new Category({
                    category: newcat
                })
                category.save()
                    .then(() => {
                        res.redirect('/category-management')
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
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
        console.log('after unique id');
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

module.exports.coupon_get = (req, res) => {
    console.log('order view');
    Coupon.find()
        .then((coupon) => {
            res.render('admin/coupon.ejs', { coupon, layout: 'layouts/adminlayout', title: 'Coupon', admin: true })
        })
}

module.exports.addCoupon = (req, res) => {
    console.log('adding coupon');
    console.log(req.body);
    Coupon.findOne({ couponCode: req.body.couponcode })
        .then(() => {
            let coupon = new Coupon({
                couponCode: req.body.couponcode,
                couponValue: req.body.couponvalue,
                minBill: req.body.minbill,
                couponExpiry: req.body.expirydate
            })
            coupon.save()
                .then(() => {
                    res.redirect('/coupon')
                })
        })
}

// delete coupon
module.exports.deleteCoupon = (req, res) => {
    console.log('deleting coupon');
    cop = req.query.id
    console.log(cop);
    Coupon.deleteOne({ couponCode: cop })
        .then(() => {
            res.redirect('/coupon')
        })
}

