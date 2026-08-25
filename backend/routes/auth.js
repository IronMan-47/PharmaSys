const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded for simplicity (As requested by user)
const ADMIN_USERNAME = 'admin1';
const ADMIN_PASSWORD = '12345678';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pharmasys_key';

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Generate a simple token valid for 24 hours
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    
    return res.json({ 
      success: true, 
      token, 
      user: { username, role: 'admin' }
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

module.exports = router;
