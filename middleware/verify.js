const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
            if (err) {
            return res.status(401).json({ message: 'Invalid token', triggerRefresh: true });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.log("Error at verification of token: ", error)
    }
}

module.exports = { verifyToken }