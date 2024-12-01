
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const pool = require('../db');


router.post('/create', authenticateToken, async (req, res) => {
  const { planName, goal, durationWeeks, days } = req.body;
  const userId = req.user.id;

  try {
    // End the current plan by setting its endDate
    await pool.query(
      `UPDATE workout_plans
       SET end_date = NOW()
       WHERE user_id = ? AND end_date IS NULL`,
      [userId]
    );

    // Insert the new workout plan
    const [newPlanResult] = await pool.query(
      `INSERT INTO workout_plans (plan_name, goal, duration_weeks, startDate, user_id)
       VALUES (?, ?, ?, NOW(), ?)`,
      [planName, goal, durationWeeks, userId]
    );

    const newPlanId = newPlanResult.insertId;

    // Insert workout plan days and exercises
    for (const day of days) {
      const { dayNo, exercises } = day;

      // Insert the day into the workout_plan_day table
      const [wplanDayResult] = await pool.query(
        `INSERT INTO workout_plan_day (plan_id, dayNo)
         VALUES (?, ?)`,
        [newPlanId, dayNo]
      );

      const wplanDayId = wplanDayResult.insertId;

      // Insert exercises for the day into workout_plan_exercise table
      for (const exercise of exercises) {
        const { exerciseId, sets, reps } = exercise;

        await pool.query(
          `INSERT INTO workout_plan_exercise (wplanDay_id, exercise_id, sets, reps)
           VALUES (?, ?, ?, ?)`,
          [wplanDayId, exerciseId, sets, reps]
        );
      }
    }

    res.status(201).json({ message: 'Workout plan created successfully' });
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Error creating workout plan' });
  }
});




router.get('/exercises', async (req, res) => {
    try {
      const [exercises] = await pool.query('SELECT * FROM exercises');
      res.status(200).json(exercises);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      res.status(500).json({ message: 'Failed to fetch exercises' });
    }
  });
  

module.exports = router;

