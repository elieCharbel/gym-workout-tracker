// routes/workoutPlans.js
const express = require('express');
const router = express.Router();
const {
  createWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  deleteWorkoutPlan
} = require('../controllers/workoutController');
const { protect } = require('../middlewares/authMiddleware');

// CRUD Routes for workout plans
router.post('/create', protect, createWorkoutPlan);  // Create a workout plan
router.get('/', protect, getWorkoutPlans);  // Get all workout plans for the logged-in user
router.put('/:plan_id', protect, updateWorkoutPlan);  // Update a workout plan by ID
router.delete('/:plan_id', protect, deleteWorkoutPlan);  // Delete a workout plan by ID

module.exports = router;


