// Import dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

// Create Express app
const app = express();

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json());  // Parse incoming requests with JSON payloads

// Import routes
const authRoutes = require('./routes/auth');
const workoutPlanRoutes = require("./routes/workoutPlans");


// Use routes
app.use('/api/auth', authRoutes);  // All authentication-related routes
app.use('/api/workout-plans', workoutPlanRoutes);


// Error Handling Middleware (optional, good for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;  // Default to port 5000 if not in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
