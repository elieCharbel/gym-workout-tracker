const express = require('express');
const pool = require('../db'); // Assuming db connection is set up in `db.js`
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/progress', authenticateToken, async (req, res) => {
    const { date, weight, bodyFatPercentage, bmi, muscleMass } = req.body;
    const userId = req.user.id;
  
    if (!date || isNaN(weight) || isNaN(bodyFatPercentage) || isNaN(bmi) || isNaN(muscleMass)) {
      return res.status(400).json({ message: 'All fields, including date, are required and must be valid.' });
    }
  
    try {
      // Insert progress or update if already exists for the same date
      const result = await pool.query(
        `
        INSERT INTO progress (user_id, date, weight, body_fat_percentage, bmi, muscle_mass)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        weight = VALUES(weight),
        body_fat_percentage = VALUES(body_fat_percentage),
        bmi = VALUES(bmi),
        muscle_mass = VALUES(muscle_mass)
        `,
        [userId, date, weight, bodyFatPercentage, bmi, muscleMass]
      );
  
      res.status(201).json({ message: 'Progress saved successfully.' });
    } catch (error) {
      console.error('Error saving progress:', error);
      res.status(500).json({ message: 'Failed to save progress.' });
    }
  });
  

  
  router.get('/progress', authenticateToken, async (req, res) => {
    const { id: userId } = req.user;
  
    try {
      const [progressData] = await pool.query(`
        SELECT date, weight, body_fat_percentage AS bodyFatPercentage, bmi, muscle_mass AS muscleMass
        FROM progress
        WHERE user_id = ?
        ORDER BY date ASC
      `, [userId]);
  
      res.status(200).json(progressData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ message: 'Failed to fetch progress' });
    }
});

  
  module.exports = router;