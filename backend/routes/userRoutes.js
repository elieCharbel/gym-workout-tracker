const express = require('express');
const { updateUserProfile } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to update user profile after initial login
router.post('/profile', authenticateToken, updateUserProfile);

module.exports = router;
