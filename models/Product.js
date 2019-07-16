const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
    name: {
        _id: ObjectId,
        type: 'string',
        required: [true, 'name field is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    }
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;