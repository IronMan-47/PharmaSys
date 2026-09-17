const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Load credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin1'; // Fallback for dev ease, but env preferred
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345678';

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("CRITICAL ERROR: JWT_SECRET is not configured");
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    // Generate a simple token valid for 24 hours
    const token = jwt.sign({ username, role: 'admin' }, secret, { expiresIn: '24h' });
    
    return res.json({ 
      success: true, 
      token, 
      user: { username, role: 'admin' }
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

module.exports = router;
