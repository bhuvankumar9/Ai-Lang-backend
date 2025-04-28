const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_jwt_secret"; // Use env file in real apps

module.exports = function (req, res, next) {
  // Get token from the 'Authorization' header and remove 'Bearer ' prefix
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verify the token using JWT_SECRET
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Attach the verified user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token error:", err.message); // Log error for debugging
    res.status(400).json({ error: 'Invalid token' });
  }
};
