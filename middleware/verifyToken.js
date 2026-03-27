const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if Authorization header is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).send({ message: "No token provided. Access Denied." });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized! Token is invalid or expired." });
        }
        req.adminId = decoded.id;
        next();
    });
};
