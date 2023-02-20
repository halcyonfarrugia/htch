const User = require("../../models/User");
const path = require("path")

const get = async (req, res) => {
    try {
        const users = await User
            .find({ isAdmin: false })
            .select('_id firstName lastName email isVerified')
            .exec()
        return res.status(200).json({ status: true, users })
    } catch (error) {
        console.log(`Error occurred in ${__filename}: `, error)
        return res.status(500).json({ error, message: "Error occurred." })
    }
}

module.exports = { get }