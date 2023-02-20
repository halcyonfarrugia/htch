const User = require('../../models/User');
const UserVerification = require('../../models/UserVerification')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

// https://stackoverflow.com/questions/72530276/how-to-send-emails-with-google-using-nodemailer-after-google-disabled-less-sure
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_EMAIL}`,
        pass: `${process.env.EMAIL_PASS}`
    }
})

const register = async (req, res) => {
    // Check if fields are all entered
    let { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: "Please enter all fields." })

    firstName = firstName.trim()
    lastName = lastName.trim()
    email = email.trim()
    password = password.trim()

    // Check if email already exists
    const foundUser = await User.findOne({ email: email })
    if (foundUser) return res.status(409).json({ message: "Email already in use." })

    // Encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword) return res.status(500).json({ message: "Internal error occurred. Please try again later.", error: "Failed to hash pass" })

    // Create user
    const user = new User({
        firstName,
        lastName,
        email,
        hashedPassword
    })
    const saveUser = await user.save()
    if (!saveUser) return res.status(500).json({ message: "Internal error occurred. Please try again later.", error: "Failed to save new user" })

    const token = jwt.sign(
        { _id: user._id},
        process.env.CONFIRM_SECRET_KEY,
        { expiresIn: '1d' }
    )

    // Create user verification schema, using user._id and new jwt token
    const userVerification = new UserVerification({
        userId: user._id,
        token: token
    })
    const userVerificationSave = await userVerification.save();
    if (!userVerificationSave) return res.status(500).json({ message: "Internal error occurred. Please try again later.", error: "Failed to save verification schema" })

    const mailOptions = {
        from: process.env.EMAIL_EMAIL,
        to: email,
        subject: "htch.com.au - Verify your email!",
        html: `<h3>Verify your email address now to complete the registration process and log in to your account!</h3>
        <a href=${process.env.CLIENT_URL + `/confirm/${token}`}>Click here to verify your account.</a>`
    }

    // Return alert message that confirmation email has been sent
    transporter.sendMail(mailOptions, (error, success) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ message: "Error occurred in trying to send verification email. Please try again later."})
        }
        return res.status(201).json({ status: true, message: "Email registered successfully. Please check your email to verify your account in order to continue." })
    })
}

module.exports = { register }