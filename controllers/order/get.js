const Order = require('../../models/Order')
const path = require('path')

const get = async (req, res) => {
    try {
        const userId = req.query.userId
        let orders;
        if (userId) {
           orders = await Order.find({ userId: userId })
        } else {
            orders = await Order.find()
        }
        return res.status(200).json({ status: true, orders })
    } catch (error) {
        console.log(`Error occured in ${__filename}: `, error)
        return res.status(500).json({ message: "Error occurred."})
    }
}

module.exports = { get }