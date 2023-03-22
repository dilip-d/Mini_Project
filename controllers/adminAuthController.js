const jwt = require('jsonwebtoken');
const { adminHandleerror } = require('../middleware/adminErrMiddleware');
const { adminloginerrorhandler } = require('../middleware/adminErrMiddleware');
const Admin = require('../models/admin');
const Category = require('../models/categorySchema');
const User = require('../models/User');
const Product = require('../models/productSchema');
const Coupon = require("../models/couponSchema");
const Banner = require("../models/bannerSchema")

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'the topsecret', {
        expiresIn: maxAge
    })
}

let validation = {
    category: false
}

let bannerValidation = {
    banner: false
}

module.exports.adminHome_get = async (req, res) => {

    try {
        const user = await User.count()
        const productCount = await Product.count()
        const productList = await Product.find({})

        let Sales = await Product.aggregate([{ $group: { _id: null, sum_val: { $sum: "$sales" } } }])
        let totalSales = (Sales[0].sum_val);

        const sales = [];
        const timeOfSale = [];
        let k = 0;
        let l = 0;
        let m = [];
        let n;

        await User.find({})
            .then((results) => {
                let sums;
                n = results.length;

                for (result of results) {
                    k++;
                    const orders = result.order
                    m.push(orders.length);

                    for (let order of orders) {
                        l++;
                        sums = m.reduce((partialSum, a) => partialSum + a, 0);
                        order = order.toJSON();

                        if (order.orderStatus !== "Order cancelled") {
                            sales.push(order.count * order.price);
                            timeOfSale.push(order.createdAt.toISOString().substring(0, 10));
                        }
                    }
                    if (l === sums && k === n) {

                        Product.find({})
                            .then((result) => {
                                const sum = function (items, prop1, prop2) {
                                    return items.reduce(function (a, b) {
                                        return parseInt(a) + (parseInt(b[prop1]) * parseInt(b[prop2]));
                                    }, 0);
                                };

                                const totals = sum(result, 'price', 'sales');

                                res.render('admin/index', { productList, productCount, result, total: totals, sales, timeOfSale, totalSales, user, layout: './layouts/adminlayout.ejs', title: 'Admin', admin: true })
                            }).catch((err) => {
                                res.status(403)
                                throw new Error(err)
                            })
                    }
                }
            })
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.adminSignup_get = (req, res) => {
    try {
        res.render('admin/adminSignup', { layout: "./layouts/adminlayout.ejs", title: 'Signup', admin: false })
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.adminSignup_post = async (req, res) => {
    const { username, password } = req.body
    try {
        await Admin.create({ username, password });
        res.redirect('/adminLogin');

    } catch (errors) {
        const errorHandler = adminHandleerror(errors);
        res.status(400).json({ errorHandler });
    }
}

module.exports.adminLogin_get = (req, res) => {
    try {
        res.render('admin/adminLogin', { layout: "./layouts/adminlayout.ejs", title: 'Login', admin: false })
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.adminLogin_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.login(username, password);
        const token = createToken(admin._id);
        res.cookie('jwt2', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ admin });
    } catch (adminerrors) {
        const adminerrorHandle = adminloginerrorhandler(adminerrors);
        res.status(400).json({ adminerrorHandle });
    }
}

module.exports.adminlogout_get = (req, res) => {
    try {
        res.cookie('jwt2', '', { maxAge: 1 });
        res.redirect('/adminLogin');
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

// category
module.exports.category = async (req, res) => {
    try {
        const result = await Category.find()
        res.render('admin/category', { result, validation, layout: 'layouts/adminlayout', title: 'Category', admin: true })
        validation.category = false
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.addCategory = async (req, res) => {
    let newcat = req.body.category
    await Category.findOne({ category: newcat })
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
                        res.status(403)
                        throw new Error(err)
                    })
            }
        })
}

module.exports.deleteCategory = async (req, res) => {
    try {
        const newcat = req.params.id
        await Category.deleteOne({ _id: newcat })
        res.redirect('/category-management')
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.banner_get = async (req, res) => {
    try {
        const result = await Banner.find()
        res.render('admin/bannerManage', { result, bannerValidation, layout: 'layouts/adminlayout', title: 'Banner', admin: true })
        bannerValidation.banner = false
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.banner_post = async (req, res) => {
    let newname = req.body.name
    await Banner.findOne({ name: newname })
        .then((result) => {
            if (result) {
                bannerValidation.banner = true
                res.redirect('/bannerManage')
            } else {
                console.log('creating banner');
                let banner = new Banner({
                    name: newname
                })
                banner.save()
                    .then(() => {
                        try {
                            let image = req.files.image;
                            image.mv('./public/banner/' + banner._id + ".jpeg");
                        }
                        catch (err) {
                            res.status(403)
                            throw new Error(err);
                        }
                        res.redirect('/bannerManage')
                    }).catch((err) => {
                        res.status(403)
                        throw new Error(err)
                    })
            }
        })
}

module.exports.deleteBanner = async (req, res) => {
    try {
        await Banner.deleteOne({ _id: req.params.id })
        res.redirect('/bannerManage')
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.viewOrder_get = async (req, res) => {

    try {
        const result = await User.find({})
        let orders = []
        for (item of result) {
            orders = orders.concat(item.order)
        }
        // const ans = orders.reverse()
        // orders.sort((a, b) => {
        //     return b.createdAt - a.createdAt;
        // });
        res.render('admin/viewOrder', { order: orders, layout: 'layouts/adminlayout', title: 'Orders', admin: true })
    } catch (error) {
        res.status(403)
        throw new Error(err)
    }
}

module.exports.adminOrderStatus = async (req, res) => {
    const orderId = req.body.orderid;
    const uniqueid = req.params.id;

    await User.findOne({ _id: orderId })
        .then((result) => {
            const user = result._id;
            const orders = result.order
            if (req.body.status == 'Delivered') {

                for (let order of orders) {
                    order = order.toJSON();
                    if (order.unique === uniqueid) {
                        Promise.all([(User.updateOne({ "_id": user, "order.unique": uniqueid }, { $set: { "order.$.orderStatus": "Delivered" } }))])
                            .then((result) => {
                                res.redirect('/viewOrder')
                            })
                            .catch((err) => {
                                res.status(403)
                                throw new Error(err)
                            })
                    }
                }
            } else if (req.body.status == 'Dispatched') {
                for (let order of orders) {
                    order = order.toJSON();
                    if (order.unique === uniqueid) {
                        Promise.all([(User.updateOne({ "_id": user, "order.unique": uniqueid }, { $set: { "order.$.orderStatus": "Dispatched" } }))])
                            .then((result) => {
                                res.redirect('/viewOrder')
                            })
                            .catch((err) => {
                                res.status(403)
                                throw new Error(err)
                            })
                    }
                }
            } else if (req.body.status == 'Cancelled') {

                for (let order of orders) {
                    order = order.toJSON();
                    if (order.unique === uniqueid) {
                        Promise.all([(User.updateOne({ "_id": user, "order.unique": uniqueid }, { $set: { "order.$.orderStatus": "Order cancelled" } })), (Product.updateOne({ "_id": order._id }, { $inc: { "stock": order.count, "sales": (order.count * -1) } }))])
                            .then((result) => {
                                res.redirect('/viewOrder')
                            })
                            .catch((err) => {
                                res.status(403)
                                throw new Error(err)
                            })
                    }
                }
            }
        })
}

module.exports.coupon_get = async (req, res) => {
    try {
        const coupon = await Coupon.find()
        res.render('admin/coupon.ejs', { coupon, layout: 'layouts/adminlayout', title: 'Coupon', admin: true })
        res.status(200)
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.addCoupon = async (req, res) => {

    try {
        await Coupon.findOne({ couponCode: req.body.couponcode })

        const coupon = new Coupon({
            couponCode: req.body.couponcode,
            couponValue: req.body.couponvalue,
            minBill: req.body.minbill,
            couponExpiry: req.body.expirydate
        })
        await coupon.save()
        res.redirect('/coupon')
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

// delete coupon
module.exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = req.params.id;
        await Coupon.deleteOne({ couponCode: coupon })
        res.redirect('/coupon')
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}