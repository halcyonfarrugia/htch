const { Client } = require('square')
const { randomUUID } = require('crypto')
const User = require("../../models/User")
const Order = require("../../models/Order")
const JSONbig = require('json-bigint')({ strict: true })

const { paymentsApi } = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: 'sandbox',
})

const pay = async (req, res) => {
    try {
        const { sourceId, phone, email, shippingAddress, totalAmount, cartItems, userId } = req.body;

        // findUser
        const user = await User.findById(userId)

        // Create Payment
        const { result } = await paymentsApi.createPayment({
            idempotencyKey: randomUUID(),
            sourceId: sourceId,
            amountMoney: {
                currency: 'AUD',
                amount: totalAmount
            }
        })

        console.log('Result: ', result)

        // Create Order
        const order = new Order({
            userId: user._id,
            userEmail: user.email,
            billingDetails: {
                shippingAddress,
                phone,
                email
            },
            cartItems,
            amount: JSONbig.stringify(result.payment),
            paymentStatus: result.status,
            status: "pending"
        })
        const save = await order.save()

        if (result.payment.status === "COMPLETED") return res.status(200).json({
            status: true,
            message: "Payment successful",
            result: JSONbig.stringify(result)
        })
        return res.json({ 
            result: JSONbig.stringify(result)
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error occurred. Please try again later."})
    }
}

module.exports = { pay }