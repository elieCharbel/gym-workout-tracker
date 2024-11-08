const express = require('express');
const pool = require("../db")
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser)
router.get('/verify', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Assuming `authenticateToken` attaches `user` to `req`

    try {
        // Query the database to check if the user exists
        const [result] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (result.length === 0) {
            // User not found, respond with unauthorized
            return res.status(401).json({ message: 'User does not exist' });
        }

        // User exists, token is valid
        res.status(200).json({ message: 'User verified' });
    } catch (error) {
        console.error('Database error during user verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;

