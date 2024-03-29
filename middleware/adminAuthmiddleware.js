const jwt = require('jsonwebtoken')
const Admin = require('../models/admin');

const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt2;
    //check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'the topsecret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/adminLogin');
            } else {
                next();
            }
        })
    } else {
        console.log('no token');
        res.render('admin/adminLogin', { layout: "./layouts/adminlayout.ejs", title: 'Login page', admin: false })
    }
}

//check current user
const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt2;
    if (token) {
        jwt.verify(token, 'the topsecret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.admin = null;
                next();
            } else {
                let admin = await Admin.findById(decodedToken.id);
                res.locals.admin = admin;
                next();
            }
        })
    }
    else {
        res.locals.admin = null;
        next();
    }
}

module.exports = { requireAdminAuth, checkAdmin };