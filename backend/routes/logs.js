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

// Delete a stock log
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid log ID' });
    
    const result = await req.db.collection('stock_logs').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ message: 'Log deleted successfully' });
    } else {
      res.status(404).json({ error: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stock log' });
  }
});

module.exports = router;
