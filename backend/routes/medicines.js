const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await req.db.collection('medicines').find({}).toArray();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

// Seed route to inject mock data
router.post('/seed', async (req, res) => {
  try {
    const mockData = [
      { name: "Paracetamol 500mg", category: "Painkiller", price: 2.5, stock: 150, targetSpecies: "Human", description: "Common painkiller and fever reducer.", composition: "Paracetamol", createdAt: new Date() },
      { name: "Amoxicillin 250mg", category: "Antibiotic", price: 12.0, stock: 8, targetSpecies: "Human", description: "Treats bacterial infections.", composition: "Amoxicillin Trihydrate", createdAt: new Date() },
      { name: "Bravecto Chew", category: "Flea & Tick", price: 450.0, stock: 25, targetSpecies: "Animal", description: "Flea and tick protection for dogs.", composition: "Fluralaner", createdAt: new Date() },
      { name: "Metformin 500mg", category: "Diabetes", price: 4.0, stock: 300, targetSpecies: "Human", description: "Manages high blood sugar.", composition: "Metformin Hydrochloride", createdAt: new Date() },
      { name: "Heartgard Plus", category: "Heartworm", price: 350.0, stock: 5, targetSpecies: "Animal", description: "Prevents heartworm disease in dogs.", composition: "Ivermectin, Pyrantel", createdAt: new Date() },
      { name: "Ibuprofen 400mg", category: "Painkiller", price: 3.5, stock: 120, targetSpecies: "Human", description: "Anti-inflammatory drug.", composition: "Ibuprofen", createdAt: new Date() },
      { name: "Cetirizine 10mg", category: "Antihistamine", price: 1.5, stock: 200, targetSpecies: "Human", description: "Allergy relief medication.", composition: "Cetirizine Hydrochloride", createdAt: new Date() },
      { name: "Felimazole", category: "Hyperthyroidism", price: 280.0, stock: 12, targetSpecies: "Animal", description: "Treats overactive thyroid in cats.", composition: "Methimazole", createdAt: new Date() },
      { name: "Aspirin 75mg", category: "Blood Thinner", price: 2.0, stock: 400, targetSpecies: "Human", description: "Prevents blood clots.", composition: "Acetylsalicylic Acid", createdAt: new Date() },
      { name: "Rimadyl 25mg", category: "Painkiller", price: 180.0, stock: 40, targetSpecies: "Animal", description: "Relieves pain and inflammation in dogs.", composition: "Carprofen", createdAt: new Date() },
      { name: "Omeprazole 20mg", category: "Antacid", price: 5.5, stock: 85, targetSpecies: "Human", description: "Reduces stomach acid.", composition: "Omeprazole", createdAt: new Date() },
      { name: "Apoquel 5.4mg", category: "Allergy", price: 520.0, stock: 4, targetSpecies: "Animal", description: "Controls itching and inflammation in dogs.", composition: "Oclacitinib", createdAt: new Date() }
    ];

    await req.db.collection('medicines').deleteMany({});
    const result = await req.db.collection('medicines').insertMany(mockData);
    res.status(201).json({ message: "Seeded successfully", count: result.insertedCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

// Add a new medicine (Stock In)
router.post('/', async (req, res) => {
  try {
    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock);
    if (isNaN(price) || price < 0) return res.status(400).json({ error: 'Valid positive price is required' });
    if (isNaN(stock) || stock < 0) return res.status(400).json({ error: 'Valid positive stock is required' });
    if (!req.body.name) return res.status(400).json({ error: 'Name is required' });

    const newMedicine = {
      name: req.body.name,
      category: req.body.category || 'Uncategorized',
      price: price,
      stock: stock,
      targetSpecies: req.body.targetSpecies || 'Human',
      description: req.body.description || '',
      composition: req.body.composition || '',
      shelfNo: req.body.shelfNo || '',
      boxNo: req.body.boxNo || '',
      createdAt: new Date(),
    };
    const result = await req.db.collection('medicines').insertOne(newMedicine);
    res.status(201).json({ _id: result.insertedId, ...newMedicine });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add medicine' });
  }
});

// Update stock (Stock Out / Adjust)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid medicine ID' });
    
    const stock = parseInt(req.body.stock);
    if (isNaN(stock) || stock < 0) return res.status(400).json({ error: 'Valid positive stock is required' });
    
    await req.db.collection('medicines').updateOne(
      { _id: new ObjectId(id) },
      { $set: { stock: stock } }
    );
    res.json({ message: 'Stock updated' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update stock' });
  }
});

// Delete a medicine
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid medicine ID' });
    
    await req.db.collection('medicines').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete medicine' });
  }
});

// Add Stock (Quick Add)
router.put('/:id/add-stock', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid medicine ID' });
    
    const { quantity, receivalDate, expiryDate } = req.body;
    const parsedQuantity = parseInt(quantity);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    // First, find the medicine to get its name
    const medicine = await req.db.collection('medicines').findOne({ _id: new ObjectId(id) });
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Update the stock
    await req.db.collection('medicines').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { stock: parsedQuantity } }
    );

    // Create a log entry
    const logEntry = {
      medicineId: new ObjectId(id),
      medicineName: medicine.name,
      quantityAdded: parsedQuantity,
      receivalDate: receivalDate || new Date(),
      expiryDate: expiryDate || null,
      timestamp: new Date()
    };

    await req.db.collection('stock_logs').insertOne(logEntry);

    res.json({ success: true, message: 'Stock updated and logged successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add stock' });
  }
});

module.exports = router;
