const express = require('express');
const { updateUserProfile } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();
const pool = require("../db");

// Route to update user profile after initial login
router.post('/profile', authenticateToken, updateUserProfile);

router.get('/profile-status', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [result] = await pool.query('SELECT profile_setup_complete FROM users WHERE user_id = ?', [userId]);

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const profileSetupComplete = result[0].profile_setup_complete;
        res.json({ profileSetupComplete });
    } catch (error) {
        console.error("Error checking profile status:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
