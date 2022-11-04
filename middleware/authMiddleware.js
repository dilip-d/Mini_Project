const jwt = require('jsonwebtoken')
const User = require('../models/User');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    //check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'the secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/userLogin');
                // next();
            } else {
                console.log(decodedToken);
                // res.redirect('/');
                next();
            }
        })
    } else {
        console.log('no token');
        res.render('./user/userLogin.ejs', { title: 'login' });
        // res.redirect('/userLogin');
        // next();
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'the secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                // console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                req.user = decodedToken;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}
module.exports = { requireAuth, checkUser };