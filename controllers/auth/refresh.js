const jwt = require('jsonwebtoken');
const User = require('../../models/User')

const refresh = async (req, res) => {
    try {
        if (!req.cookies?.jwt) return res.status(401).json({ message: "User is not authenticated." })
        const currentToken = req.cookies.jwt
        res.clearCookie('jwt', { sameSite: 'none', secure: true, httpOnly: true })

        const user = await User.findOne({ refreshToken: currentToken })

        if (!user) return res.status(404).json({ message: "No refresh token in database." })

        const decoded = jwt.verify(currentToken, process.env.REFRESH_SECRET_KEY)

        if (!decoded) {
            user.refreshToken = null;
            const save = await user.save()
            return res.status(400).json({ message: "Expired refresh token." })
        } 

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
        const saved = await foundUser.save();

        res.cookie('jwt', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 5, sameSite: 'none', secure: true, httpOnly: true })

        return res.status(200).json({ status: true, token: accessToken, isAdmin: user.isAdmin, message: "Refresh token successful."})
    } catch (error) {
        console.log(`Error occurred in refresh.js: `, error)
        return res.status(500).json({ message: "Error occurred in refresh.", error })
    }
}

module.exports = { refresh }