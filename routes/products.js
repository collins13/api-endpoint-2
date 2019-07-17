const express = require("express");
const debug = require("debug")("app:products");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
// const fileFilter = (req, file, cb) => {
//     // The function should call `cb` with a boolean
//     // to indicate if the file should be accepted

//     // To reject this file pass `false`, like so:
//     if (
//         file.mimetype === "image/jpeg" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/png"
//     ) {

//         cb(null, false);
//     } else {
//         cb(null, false);
//         // You can always pass an error if something goes wrong:
//         cb(new Error("I don't have a clue!"));
//     }

// };
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
    // fileFilter: fileFilter
});
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id cover_image")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        cover_image: doc.cover_image,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    };
                })
            };
            debug(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            debug(err);
            res.status(500).json({ error: err });
        });
});

router.post("/", upload.single("cover_image"), (req, res, next) => {
    console.log(req.file);
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        cover_image: req.file.path
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "product successfully created",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result.id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
router.get("/:id", (req, res, next) => {
    id = req.params.id;
    Product.findById(id)
        .select("name price _id cover_image")
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs) {
                res.status(200).json({
                    Products: docs,
                    request: {
                        description: "get all products",
                        ur: "http://localhost:3000/products"
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
router.put("/:id", (req, res, next) => {
    const id = req.params.id;

    Product.findByIdAndUpdate({ _id: id }, req.body).then(() => {
        Product.findOne({ _id: id })
            .then(result => {
                res.status(200).json({
                    message: "product updated",
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products"
                    }
                });
            })
            .catch(err => {
                debug(err);
                console.log(err);
                res.status(500).json({ error: err });
            });
    });
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    // Product.update({ _id: id }, { $set: updateOps })
    //     .exec()
    //     .then(result => {
    //         res.status(200).json({ message: 'product updated' });
    //     })
    //     .catch(err => {
    //         debug(err);
    //         console.log(err);
    //         res.status(500).json({ error: err });

    //     });

    res.status(200).json({
        message: "you updated your product"
    });
});
router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "product deleted",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products"
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