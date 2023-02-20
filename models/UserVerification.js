const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true }
})

module.exports = mongoose.model('UserVerification', userVerificationSchema)