
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user to the request object (req.user)
      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);  // Log any verification errors
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error("No token provided");  // Log if no token is provided
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
