// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');





const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    
    if (!token) {
        console.error("Access Denied: No token provided.");
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Token Verification Failed:", err.message);
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // Attach user data (from the token payload) to req.user
        req.user = user; // `user` will contain { id: user_id }
        next();
    });
};

module.exports = authenticateToken;
