const express = require("express");
const debug = require("debug")("app:products");
const router = express.Router();
const Product = require('../models/Product');

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "handling GET request"
    });
});

router.post("/", (req, res, next) => {
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new Product()
    product = {
        _id: new ObjectId(),
        name: req.body.name,
        price: req.body.price
    }
    product.save().then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err)
    })
    res.status(200).json({
        message: "handling POST request",
        product: product
    });
});
router.get("/:id", (req, res, next) => {
    id = req.params.id;
    if (id === "special") {
        res.status(200).json({
            message: "you discovered special id",
            id: id
        });
    } else {
        res.status(200).json({
            message: "you passed some id"
        });
    }
});
router.put("/:id", (req, res, next) => {
    res.status(200).json({
        message: "you updated your product"
    });
});
router.delete("/:id", (req, res, next) => {
    res.status(200).json({
        message: "you deleted your product"
    });
});

module.exports = router;