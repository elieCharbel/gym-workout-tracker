const Joi = require('joi');
const WorkoutPlan = require('../models/WorkoutPlan');
const { v4: uuidv4 } = require('uuid');  // To generate unique IDs for workout plans


const workoutPlanSchema = Joi.object({
    plan_name: Joi.string().min(3).required(),
    goal: Joi.string().required(),
    duration_weeks: Joi.number().integer().required(),
    startDate: Joi.date().required(),
    end_Date: Joi.date().required(),
  });
  
  // Create a new workout plan
  const createWorkoutPlan = (req, res) => {
    const { error } = workoutPlanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const { plan_name, goal, duration_weeks, startDate, end_Date } = req.body;
  
    const workoutPlan = new WorkoutPlan(
      uuidv4(),  // Generate unique plan_id
      req.user.id,  // userId associated with this plan
      plan_name,
      goal,
      duration_weeks,
      startDate,
      end_Date
    );
  
    WorkoutPlan.create(workoutPlan);
  
    res.status(201).json({ message: 'Workout plan created', workoutPlan });
  };

// Get all workout plans for the logged-in user
const getWorkoutPlans = (req, res) => {
  const workoutPlans = WorkoutPlan.findByUserId(req.user.id);
  res.status(200).json(workoutPlans);
};

// Update a workout plan by ID
const updateWorkoutPlan = (req, res) => {
    const { error } = workoutPlanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const { plan_name, goal, duration_weeks, startDate, end_Date } = req.body;
  
    const updatedPlan = WorkoutPlan.update(req.params.plan_id, {
      plan_name,
      goal,
      duration_weeks,
      startDate,
      end_Date,
    });
  
    if (updatedPlan) {
      res.status(200).json({ message: 'Workout plan updated', updatedPlan });
    } else {
      res.status(404).json({ message: 'Workout plan not found' });
    }
  };

// Delete a workout plan by ID
const deleteWorkoutPlan = (req, res) => {
  const deletedPlan = WorkoutPlan.delete(req.params.plan_id);

  if (deletedPlan) {
    res.status(200).json({ message: 'Workout plan deleted' });
  } else {
    res.status(404).json({ message: 'Workout plan not found' });
  }
};

module.exports = {
  createWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};
