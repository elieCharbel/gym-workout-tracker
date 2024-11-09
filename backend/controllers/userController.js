const pool = require('../db');

// Update user profile after initial login
const updateUserProfile = async (req, res) => {
    const { weight, height, experience, goal } = req.body;
    const userId = req.user.id;

    // Optional: Validate experience level before updating
    const validExperienceLevels = ['beginner', 'intermediate', 'expert'];
    if (!validExperienceLevels.includes(experience)) {
        return res.status(400).json({ success: false, message: 'Invalid experience level' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET weight = ?, height = ?, experience_level = ?, fitness_goal = ?, profile_setup_complete = TRUE WHERE user_id = ?',
            [weight, height, experience, goal, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Database error during profile update:', error);
        res.status(500).json({ success: false, message: 'Database update failed' });
    }
};


module.exports = { updateUserProfile };
