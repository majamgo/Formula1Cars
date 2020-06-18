const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


// GETTING ALL - http://localhost:9090/admin/user
router.get('/', async (req, res) => {

    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "There's been a mistake - " + err.message });
    }
});


// CREATING ONE - http://localhost:9090/admin/user
router.post('/', async (req, res) => {

    try {
        let user = await User.findOne({ username: req.body.username, email: req.body.email });

        if (user) {
            return res.status(401).json({ message: "The user already exists" });
        } else {
            user = new User(req.body);
            const newUser = await user.save();
            return res.status(201).json({ message: "New user is created", newUser: newUser });
            }
        } catch (err) {
            res.status(400).json({ message: "Fail - something went wrong: " + err.message });
        }
    });


module.exports = router;