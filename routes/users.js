const express = require("express");
const debug = require("debug")("app:users");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        if (user.length >= 1) {
            return res.status(422).json({
                message: "the used email already exist"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    debug(err);
                    return res.status(500).json({ error: err });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                        .save()
                        .then(result => {
                            debug(result);
                            res.status(200).json({ messag: "account succesfully created" });
                        })
                        .catch(err => {
                            debug(err);
                            res
                                .status(401)
                                .json({ messag: "username or password is invalid" });
                        });
                }
            });
        }
    });
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user < 1) {
                return res.status(404).json({ message: "authetication failed" });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    debug(err);
                    return res.status(404).json({ message: "authetication failed" });
                }
                if (result) {
                    const token = jwt.sign({ email: user[0].email, userId: user[0]._id },
                        process.env.JWT_KEY, {
                            expiresIn: '1h'
                        }
                    );
                    debug(result);
                    return res.status(200).json({ message: "successfully loged in", token: token });
                }
                return res.status(200).json({ message: "auth faild" });
            });
        })
        .catch(err => {
            debug(err);
            res.status(500).json({ error: err });
        });
});

router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            debug(result);
            res.status(200).json({ message: "User deleted successfully" });
        })
        .catch(err => {
            debug(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;