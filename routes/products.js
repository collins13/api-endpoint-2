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
const checkAuth = require("../middleware/check-auth");
const productController = require("../controller/productController");
const mongoose = require("mongoose");

router.get("/", productController.getProducts);

router.post(
    "/",
    checkAuth,
    upload.single("cover_image"),
    productController.createProduct
);
router.get("/:id", productController.getProductId);
router.put("/:id", checkAuth, productController.update);
router.delete("/:id", checkAuth, productController.delete);

module.exports = router;