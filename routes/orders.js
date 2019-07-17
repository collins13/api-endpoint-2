const express = require("express");
const debug = require("debug")("app:orders");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const checkAuth = require("../middleware/check-auth");
const orderController = require("../controller/orderControler");
const mongoose = require("mongoose");

router.get("/", checkAuth, orderController.getOrders);

router.post("/", checkAuth, orderController.postOrder);
router.get("/:orderId", checkAuth, orderController.getOrdersId);
router.put("/:orderId", checkAuth, (req, res, next) => {
    res.status(200).json({
        message: "you updated your order",
        orderId: req.params.orderId
    });
});
router.delete("/:orderId", checkAuth, orderController.getDelete);

module.exports = router;