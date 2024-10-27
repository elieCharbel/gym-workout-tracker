// Temporary in-memory storage for workout plans (replace with DB later)
let workoutPlans = [];

class WorkoutPlan {
  constructor(plan_id, userId, plan_name, goal, duration_weeks, startDate, end_Date) {
    this.plan_id = plan_id;  // Unique identifier for each workout plan
    this.userId = userId;  // Links the workout plan to a specific user
    this.plan_name = plan_name;  // Name of the workout plan
    this.goal = goal;  // Fitness goal associated with this plan
    this.duration_weeks = duration_weeks;  // Number of weeks the plan will last
    this.startDate = startDate;  // Start date of the workout plan
    this.end_Date = end_Date;  // End date of the workout plan
  }

  // Save a new workout plan
  static create(workoutPlan) {
    workoutPlans.push(workoutPlan);
    return workoutPlan;
  }

  // Retrieve all workout plans for a specific user
  static findByUserId(userId) {
    return workoutPlans.filter(plan => plan.userId === userId);
  }

  // Update a workout plan by ID
  static update(plan_id, updatedPlan) {
    const index = workoutPlans.findIndex(plan => plan.plan_id === plan_id);
    if (index !== -1) {
      workoutPlans[index] = { ...workoutPlans[index], ...updatedPlan };
      return workoutPlans[index];
    }
    return null;
  }

  // Delete a workout plan by ID
  static delete(plan_id) {
    const index = workoutPlans.findIndex(plan => plan.plan_id === plan_id);
    if (index !== -1) {
      return workoutPlans.splice(index, 1);
    }
    return null;
  }
}

module.exports = WorkoutPlan;
