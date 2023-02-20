const User = require("../../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(409).json({
            message: "Please fill in alln fields"
        })

        email.trim()
        password.trim()

        const user = await User.findOne({ email: email })
        if (!user) return res.status(404).json({ message: "Email or password invalid. Please try again."})

        if (!user.isVerified) return res.status(401).json({ message: "Email has not been verified/confirmed yet. Please verify."})

        const pass = await bcrypt.compare(password, user.hashedPassword)
        if (!pass) return res.status(409).json({ message: "Email or password invalid. Please try again." })

        const accessToken = jwt.sign(
            {
                "_id": user._id,
                "email": user.email,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "isAdmin": user.isAdmin
            },
            process.env.ACCESS_SECRET_KEY,
            {
                expiresIn: '2d'
            }
        )

        const refreshToken = jwt.sign(
            {
                "_id": user._id,
            },
            process.env.REFRESH_SECRET_KEY,
            {
                expiresIn: '5d'
            }
        )

        user.refreshToken = refreshToken;
        const save = await user.save();

        console.log(user)
        
        if (req.cookies?.jwt) {
                res.clearCookie('jwt', { sameSite: 'none', secure: true, httpOnly: true })
            }
        res.cookie('jwt', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 5, sameSite: 'none', secure: true, httpOnly: true })

        return res.status(201).json({
            status: true, 
            _id: user._id,
            token: accessToken,
            isAdmin: user.isAdmin,
            message: "Login successful. Redirecting user to homepage..."
        })

    } catch (error) {
        console.log(`Error occurred in login.js: `, error)
        return res.status(500).json({
            message: "Error occurred. Please try again later",
            error
        })
    }
}

module.exports = { login }