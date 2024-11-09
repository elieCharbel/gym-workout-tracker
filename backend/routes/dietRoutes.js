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

// Fetch meal logs for the current week
router.get('/meal-logs/week', authenticateToken, async (req, res) => {
    try {
      // Calculate start and end of the week as in the previous example
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
  
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
  
      const startOfWeekStr = startOfWeek.toISOString().slice(0, 19).replace("T", " ");
      const endOfWeekStr = endOfWeek.toISOString().slice(0, 19).replace("T", " ");
  
      // Query to join meal_logs with meals to retrieve meal name and calories
      const [mealLogs] = await pool.query(`
        SELECT meal_logs.date, meal_logs.meal_type, meal_logs.nb_of_servings, 
               meals.meal_name, meals.calories * meal_logs.nb_of_servings AS total_calories
        FROM meal_logs
        JOIN meals ON meal_logs.meal_id = meals.meal_id
        WHERE meal_logs.date BETWEEN ? AND ?
        ORDER BY meal_logs.date ASC
      `, [startOfWeekStr, endOfWeekStr]);
  
      res.json(mealLogs);
    } catch (error) {
      console.error("Error fetching weekly meal logs:", error);
      res.status(500).json({ message: "Failed to fetch weekly meal logs" });
    }
  });

  

// Add a new meal log
router.post('/meal-logs', authenticateToken, async (req, res) => {
    const { mealType, mealId, nb_of_servings } = req.body;
  
    try {
      // Set the current date and time in DATETIME format
      const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  
      // Insert into meal_logs with current date and time
      const result = await pool.query(`
        INSERT INTO meal_logs (date, meal_type, meal_id, nb_of_servings)
        VALUES (?, ?, ?, ?)
      `, [currentDateTime, mealType, mealId, nb_of_servings || 1]); // Use 1 as default if `nb_of_servings` is not provided
  
      res.status(201).json({ message: 'Meal log added successfully' });
    } catch (error) {
      console.error('Error adding meal log:', error);
      res.status(500).json({ message: 'Failed to add meal log' });
    }
  });
module.exports = router;
