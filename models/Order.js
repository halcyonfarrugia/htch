const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    billingDetails: {
        shippingAddress: { type: Object },
        phone: { type: String },
        email: { type: String }
    },
    cartItems: { type: Array },
    payment: { type: String },
    paymentStatus: { type: String },
    status: { type: String, default: "pending" }
})

module.exports = mongoose.model('Order', orderSchema);