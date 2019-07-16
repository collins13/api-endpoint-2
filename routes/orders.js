const express = require("express");
const debug = require("debug")("app:orders");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "order was fetched"
    });
});

router.post("/", (req, res, next) => {
    const orders = {
        orderId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: "order was created"
    });
});
router.get("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "single order"
    });
});
router.put("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "you updated your order",
        orderId: req.params.orderId
    });
});
router.delete("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "you deleted your oder",
        orderId: req.params.orderId
    });
});

module.exports = router;