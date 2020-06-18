const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


// LOGIN - http://localhost:9090/auth/login
router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.status(401).json({ message: "The username doesn't exist in the system" });
    }

    user.comparePassword(password, function (err, isMatch) {

        if (err) {
            throw err;
        }

        if (isMatch) {
            req.session.userId = user._id;
            res.json({ username: user.username, userID: user._id });
        } else {
            res.status(401).clearCookie(process.env.SESS_NAME).json({ message: "The password didn't match" });
        }
    });
});


// LOGOUT - http://localhost:9090/auth/logout
router.get('/logout', async (req, res) => {

    req.session.destroy(err => {
        if(err) return res.status(500).json({ message: "Logout didn't succes - try again" });

        res.clearCookie(process.env.SESS_NAME).status(200).json({ message: "Cookie is deleted" });
    });
});


// LOGGED IN? - http://localhost:9090/auth/loggedin
router.get('/loggedin', async (req, res) => {

    if(req.session.userId) {
        return res.status(200).json({ message: "Login is still active" });
    } else {
        return res.status(401).json({ message: "Login doesn't exist anymore or is expired" });
    }
});


module.exports = router;