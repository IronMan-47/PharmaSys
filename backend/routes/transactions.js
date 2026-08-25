const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await req.db.collection('transactions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction (POS Billing checkout)
router.post('/', async (req, res) => {
  const { items, customerName, zipCode } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in transaction' });
  }

  let totalAmount = 0;

  try {
    // 1. Calculate total and verify stock
    for (const item of items) {
      const medicine = await req.db.collection('medicines').findOne({ _id: new ObjectId(item.medicineId) });
      if (!medicine) return res.status(404).json({ error: `Medicine ${item.name} not found` });
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}` });
      }
      totalAmount += (item.quantity * medicine.price);
    }

    // 2. Reduce stock for each item
    for (const item of items) {
      await req.db.collection('medicines').updateOne(
        { _id: new ObjectId(item.medicineId) },
        { $inc: { stock: -item.quantity } }
      );
    }

    // 3. Save the transaction (Preparing for future AI Regression models with zipCode & timestamp)
    const newTransaction = {
      items,
      totalAmount,
      customerName: customerName || 'Walk-in Customer',
      zipCode: zipCode || 'Unknown',
      createdAt: new Date(),
    };

    const result = await req.db.collection('transactions').insertOne(newTransaction);
    res.status(201).json({ _id: result.insertedId, ...newTransaction });
  } catch (err) {
    res.status(400).json({ error: 'Checkout failed' });
  }
});

// Delete a single transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await req.db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete transaction' });
  }
});

// Delete all transactions
router.delete('/', async (req, res) => {
  try {
    await req.db.collection('transactions').deleteMany({});
    res.json({ message: 'All transactions deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete all transactions' });
  }
});

module.exports = router;
