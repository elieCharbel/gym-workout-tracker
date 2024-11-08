const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, gender, age, phone, email, password } = req.body;

  try {
    // Check if the user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO users (firstName, lastName, gender, age, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, gender, age, phone, email, hashedPassword]
    );

    // Respond with success
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Login user and generate JWT token
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const [userResult] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = userResult[0];

      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Include profile setup status in the response
      res.json({ token, profileSetupComplete: user.profile_setup_complete });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerUser, loginUser };
