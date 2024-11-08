// routes/workoutPlans.js
const express = require('express');
const router = express.Router();
const {
  createWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  deleteWorkoutPlan
} = require('../controllers/workoutController');
const authenticateToken = require('../middlewares/authMiddleware');

// CRUD Routes for workout plans
router.post('/create', authenticateToken, createWorkoutPlan);  // Create a workout plan
router.get('/', authenticateToken, getWorkoutPlans);  // Get all workout plans for the logged-in user
router.put('/:plan_id', authenticateToken, updateWorkoutPlan);  // Update a workout plan by ID
router.delete('/:plan_id', authenticateToken, deleteWorkoutPlan);  // Delete a workout plan by ID

module.exports = router;


