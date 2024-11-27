// Import dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Allows requests from port 5500
app.use(express.json());  // Parse incoming requests with JSON payloads

// Import routes
const authRoutes = require('./routes/auth');
const workoutPlanRoutes = require("./routes/workoutPlans");
const userRoutes = require('./routes/userRoutes');
const dietRoutes = require('./routes/dietRoutes');
const progressRoutes = require('./routes/progressRoutes');




// Use routes
app.use('/api/auth', authRoutes);  // All authentication-related routes
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/user', userRoutes);
app.use('/api', dietRoutes);
app.use('/api', progressRoutes);

// Error Handling Middleware (optional, good for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows); // Return the list of users
  } catch (error) {
    console.error(error);
    res.status(500).send('Database error');
  }
});

// Start server
const PORT = process.env.PORT || 5000;  // Default to port 5000 if not in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

