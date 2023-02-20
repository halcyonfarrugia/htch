const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
    category: { type: String, required: true },
    status: { type: String, default: null },
    description: { type: String, required: true },
    price: { type: Number },
    oldPrice: { type: Number },
    newPrice: { type: Number },
    size: { type: Array, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true }
})

module.exports = mongoose.model('Product', productSchema)