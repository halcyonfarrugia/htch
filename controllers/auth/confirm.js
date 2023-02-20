const User = require("../../models/User");
const UserVerification = require("../../models/UserVerification");

const confirm = async (req, res) => {
    // Check in params for token
    const { token } = req.params
    if (!token) return res.status(400).json({ message: "Error occurred. No token passed." })

    // Search token in user verification collection
    const foundUserVerification = await UserVerification.findOne({ token: token })
    if (!foundUserVerification) return res.status(404).json({ message: "Error occurred. Email not found." })

    // Once found, search user using userVerification._id
    const user = await User.findOne({ _id: foundUserVerification.userId })
    user.isVerified = true
    await user.save();

    return res.status(200).json({ status: true, message: "Great news! Your email has been successfully verified. Feel free to log in now."})
}

module.exports = { confirm }