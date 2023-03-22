const User = require('../models/User');

module.exports.userManage_get = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('admin/userManage', { user: users, layout: "./layouts/adminlayout.ejs", title: 'user manage', admin: true })

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.blockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate({ _id: req.params.id }, { isBlocked: true })
        res.redirect('/userManage');
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}

module.exports.unblockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate({ _id: req.params.id }, { isBlocked: false })
        res.redirect('/userManage');
    } catch (error) {
        res.status(403)
        throw new Error(error)
    }
}