const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports.userManage_get = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('admin/userManage', { user: users, layout: "./layouts/adminlayout.ejs", title: 'user manage', admin: true })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.blockUser = async (req, res) => {
    const userId = req.params.id
    const user = await User.findByIdAndUpdate({ _id: userId }, { isBlocked: true })
    res.redirect('/userManage');
}

module.exports.unblockUser = async (req, res) => {
    const userId = req.params.id
    const user = await User.findByIdAndUpdate({ _id: userId }, { isBlocked: false })
    res.redirect('/userManage');
}