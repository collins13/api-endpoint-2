const express = require("express");

const app = express();
const path = require('path');

const debug = require("debug")("app");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

const productRoutes = require("./routes/products");

const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

//mongoose.connect('mongodb+srv://roman21:roman2147@cluster0-kbmjr.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });
// mongoose.connect('mongodb://roman21:roman2147@ds151076.mlab.com:51076/productapi', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost/products', { useNewUrlParser: true });
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, PATCH");
        res, status(200).json({});
    }
    next();
});

// if (req.method === 'OPTIONS') {
//     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, PATCH");
// }

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.listen(port, () => console.log(`port listening ${port}`));

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});