const express = require('express');
const router = express.Router();

// Fetch all stock logs
router.get('/', async (req, res) => {
  try {
    const logs = await req.db.collection('stock_logs')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock logs' });
  }
});

module.exports = router;
