const express = require('express');
const pool = require('../db'); // Assuming db connection is set up in `db.js`
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

// Fetch all available meals
router.get("/meals", authenticateToken, async (req, res) => {
    const mealType = req.query.mealType; // Read mealType from query parameters
  
    try {
      let query = "SELECT * FROM meals";
      const queryParams = [];
  
      if (mealType) {
        query += " WHERE meal_type = ?";
        queryParams.push(mealType);
      }
  
      const [meals] = await pool.query(query, queryParams);
  
      res.json(meals); // Return filtered meals
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });


// Update to fetch daily meal logs for the user
router.get('/meal-logs/day', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    // Fetch today's date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split('T')[0];

    // Fetch meals for the current user and today's date
    const [mealLogs] = await pool.query(`
      SELECT ml.meal_log_id, ml.date, ml.meal_type, ml.nb_of_servings,
             m.meal_name, m.calories * ml.nb_of_servings AS total_calories,
             m.protein_grams * ml.nb_of_servings AS total_protein,
             m.carbs_grams * ml.nb_of_servings AS total_carbs,
             m.fat_grams * ml.nb_of_servings AS total_fat
      FROM meal_logs ml
      JOIN meals m ON ml.meal_id = m.meal_id
      WHERE ml.nutplan_id = (
          SELECT nutplan_id FROM nutrition_plans
          WHERE user_id = ? AND end_date IS NULL
          ORDER BY start_date DESC LIMIT 1
      )
      AND DATE(ml.date) = ?
    `, [userId, today]);
  
    res.json(mealLogs);
  } catch (error) {
    console.error('Error fetching daily meals:', error);
    res.status(500).json({ message: 'Failed to fetch daily meal logs' });
  }
});



// Add a new meal log
router.post('/meal-logs', authenticateToken, async (req, res) => {
  const { datetime, mealType, mealId, servings } = req.body;
  const { id: userId } = req.user;

  try {
    // Fetch the active nutrition plan ID for the user
    const [nutritionPlanResult] = await pool.query(`
      SELECT nutplan_id FROM nutrition_plans
      WHERE user_id = ? AND end_date IS NULL
      ORDER BY start_date DESC LIMIT 1
    `, [userId]);

    if (nutritionPlanResult.length === 0) {
      return res.status(400).json({ message: 'No active nutrition plan found.' });
    }

    const nutplan_id = nutritionPlanResult[0].nutplan_id;

    // Insert the new meal log with the fetched nutplan_id
    const [insertResult] = await pool.query(`
      INSERT INTO meal_logs (date, meal_type, meal_id, nb_of_servings, nutplan_id)
      VALUES (?, ?, ?, ?, ?)
    `, [datetime, mealType, mealId, servings, nutplan_id]);

    
    res.status(201).json({ message: 'Meal log added successfully' });
  } catch (error) {
    
    res.status(500).json({ message: 'Failed to add meal log' });
  }
});

// Create a new meal plan
router.post('/meal-plans', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { planName, dailyCalories, dailyProtein, dailyCarbs, dailyFats } = req.body;

  try {
    // End any existing meal plans for the user
    await pool.query("UPDATE nutrition_plans SET end_date = CURRENT_DATE WHERE user_id = ? AND end_date IS NULL", [userId]);

    // Insert new meal plan with specified goals and start date
    const [result] = await pool.query(
      "INSERT INTO nutrition_plans (plan_name, user_id, calories_per_day, protein_grams, carbs_grams, fat_grams, start_date) VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)",
      [planName, userId, dailyCalories, dailyProtein, dailyCarbs, dailyFats]
    );

    res.status(201).json({ message: 'Meal Plan Created', planId: result.insertId });
  } catch (error) {
    console.error("Error creating meal plan:", error);
    res.status(500).json({ message: "Failed to create meal plan" });
  }
});

// End the current meal plan
router.post('/meal-plans/end', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // Update the end_date of the active meal plan for this user
    const [result] = await pool.query(
      "UPDATE nutrition_plans SET end_date = CURRENT_DATE WHERE user_id = ? AND end_date IS NULL",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No active meal plan to end" });
    }

    res.status(200).json({ message: "Meal Plan Ended" });
  } catch (error) {
    console.error("Error ending meal plan:", error);
    res.status(500).json({ message: "Failed to end meal plan" });
  }
});

// Fetch current active meal plan
router.get('/meal-plans/current', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "SELECT * FROM nutrition_plans WHERE user_id = ? AND end_date IS NULL ORDER BY start_date DESC LIMIT 1",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No active meal plan" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching current meal plan:", error);
    res.status(500).json({ message: "Failed to fetch current meal plan" });
  }
});

// Fetch current meal plan goals for the user
router.get('/meal-plans/goals', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "SELECT calories_per_day, protein_grams, carbs_grams, fat_grams FROM nutrition_plans WHERE user_id = ? AND end_date IS NULL ORDER BY start_date DESC LIMIT 1",
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No active meal plan found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching meal plan goals:", error);
    res.status(500).json({ message: "Failed to fetch meal plan goals" });
  }
});

// Get daily nutrient progress
router.get('/daily-progress', authenticateToken, async (req, res) => {
  try {
      const { id: userId } = req.user;

      // Fetch progress for today's date and current nutrition plan
      const [progress] = await pool.query(`
          SELECT calories, protein, carbs, fat
          FROM daily_nutrient_progress
          WHERE nutplan_id = (
              SELECT nutplan_id FROM nutrition_plans
              WHERE user_id = ? AND end_date IS NULL 
              ORDER BY start_date DESC LIMIT 1
          )
          AND date = CURDATE()
      `, [userId]);

      res.json(progress[0] || { calories: 0, protein: 0, carbs: 0, fat: 0 });
  } catch (error) {
      console.error('Error fetching daily nutrient progress:', error);
      res.status(500).json({ message: 'Failed to fetch daily nutrient progress' });
  }
});


// Update daily nutrient progress
router.put('/daily-progress', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { date, calories, protein, carbs, fats } = req.body; // Include `date` in the request body

  try {
    const [result] = await pool.query(`
      SELECT nutplan_id FROM nutrition_plans
      WHERE user_id = ? AND end_date IS NULL
      ORDER BY start_date DESC LIMIT 1
    `, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No active nutrition plan found" });
    }

    const nutplan_id = result[0].nutplan_id;

    // Update or insert the row for the specific date
    await pool.query(`
      INSERT INTO daily_nutrient_progress (date, calories, protein, carbs, fat, nutplan_id)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        calories = calories + VALUES(calories),
        protein = protein + VALUES(protein),
        carbs = carbs + VALUES(carbs),
        fat = fat + VALUES(fat)
    `, [date, calories, protein, carbs, fats, nutplan_id]);

    res.status(200).json({ message: "Daily nutrient progress updated" });
  } catch (error) {
    console.error("Error updating daily progress:", error);
    res.status(500).json({ message: "Failed to update daily progress" });
  }
});

// Delete a meal log
router.delete('/meal-logs/:mealLogId', authenticateToken, async (req, res) => {
  const { mealLogId } = req.params;
  const { id: userId } = req.user;

  try {
    // Verify the meal log belongs to the current user's nutrition plan
    const [result] = await pool.query(`
      DELETE ml
      FROM meal_logs ml
      JOIN nutrition_plans np ON ml.nutplan_id = np.nutplan_id
      WHERE ml.meal_log_id = ? AND np.user_id = ? AND DATE(ml.date) = CURDATE()
    `, [mealLogId, userId]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Meal log not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Meal log deleted successfully.' });
  } catch (error) {
    console.error('Error deleting meal log:', error);
    res.status(500).json({ message: 'Failed to delete meal log.' });
  }
});

// Update daily nutrient progress after deleting a meal log
router.put('/daily-progress/deduct', authenticateToken, async (req, res) => {
  const { date, calories, protein, carbs, fats } = req.body;
  const { id: userId } = req.user;

  try {
    // Fetch the active nutrition plan ID for the user
    const [nutritionPlanResult] = await pool.query(`
      SELECT nutplan_id FROM nutrition_plans
      WHERE user_id = ? AND end_date IS NULL
      ORDER BY start_date DESC LIMIT 1
    `, [userId]);

    if (nutritionPlanResult.length === 0) {
      return res.status(400).json({ message: 'No active nutrition plan found.' });
    }

    const nutplan_id = nutritionPlanResult[0].nutplan_id;

    // Deduct the values from daily progress for the specified date
    const [updateResult] = await pool.query(`
      UPDATE daily_nutrient_progress
      SET 
        calories = GREATEST(0, calories - ?),
        protein = GREATEST(0, protein - ?),
        carbs = GREATEST(0, carbs - ?),
        fat = GREATEST(0, fat - ?)
      WHERE date = ? AND nutplan_id = ?
    `, [calories, protein, carbs, fats, date, nutplan_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'No progress found for the specified date.' });
    }

    res.status(200).json({ message: 'Daily progress updated successfully.' });
  } catch (error) {
    console.error('Error updating daily progress:', error);
    res.status(500).json({ message: 'Failed to update daily progress.' });
  }
});


module.exports = router;