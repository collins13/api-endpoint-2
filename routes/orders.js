const express = require("express");
const debug = require("debug")("app:orders");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
    Order.find()
        .select("_id quantity product")
        .populate('product')
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        product: doc.id,
                        quantity: doc.quantity,

                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json({ response });
        })
        .catch(err => {
            debug(err);
            res.status(500).json({ error: err });
        });
});

router.post("/", (req, res, next) => {
    Product.findById(req.body.id)

    .then(product => {
            if (!product) {
                return res.status(404).json({ message: "product not found" });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.id
            });
            debug(order);
            return order.save();
        })
        .then(result => {
            console.log(result);
            debug(result);
            res.status(200).json({
                message: "order created successfully",
                createdOrder: {
                    id: result._id,
                    product: result.id,
                    quantity: result.quantity,
                    getOrders: {
                        type: "GET",
                        url: "http://localhost:3000/orders"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            debug(err);
            res.status(500).json({ error: err });
        });
});
router.get("/:orderId", (req, res, next) => {
    orderId = req.params.orderId;
    Order.findById(orderId)
        .select("id quantity _id")
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs) {
                res.status(200).json({
                    orders: docs,
                    request: {
                        description: "get all orders",
                        ur: "http://localhost:3000/orders"
                    }
                });
                debug(docs);
            } else {
                res.status(404).json({
                    message: "No valid entry found for the requested productid"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
            debug(err);
        });
});
router.put("/:orderId", (req, res, next) => {
    res.status(200).json({
        message: "you updated your order",
        orderId: req.params.orderId
    });
});
router.delete("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'order not found' });
            }
            res.status(200).json({
                message: "you deleted your oder",
                orderId: req.params.orderId,
                quantity: req.params.quantity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            });
        })
        .catch(err => {
            debug(err);
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;