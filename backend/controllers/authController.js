// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming you have a User model

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists (this will be more relevant when a database is integrated)
  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);  // 10 is the number of salt rounds (more rounds = more secure but slower)
    
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user (replace this logic with a database save operation later)
    const newUser = new User(name, email, hashedPassword);
    newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Catch any errors and return a server error status
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = User.findByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare the entered password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token });
};

module.exports = { loginUser, registerUser };

