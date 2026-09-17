# Backend Training - Part 4: Transactions & Spatial Data Pipeline

The `routes/transactions.js` file handles the checkout process. This is the most critical business logic in the application, as it not only records revenue but also collects our spatial data.

### 1. Intercepting the Checkout Payload
When the pharmacist clicks "Complete Purchase", React sends a massive JSON object containing the entire shopping cart, the total amount, and the customer's Zip Code.

```javascript
router.post('/', async (req, res) => {
  try {
    const { cart, total, zipCode, customerName } = req.body;
```

### 2. The Spatial Data Injection
This is the feature that separates PharmaSys from legacy software. We actively bind the demographic Zip Code to the financial transaction.

```javascript
    const transactionRecord = {
      customerName: customerName || 'Walk-in',
      zipCode: zipCode, // <-- The Epidemological Anchor
      items: cart.map(item => ({
        medicineId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total,
      createdAt: new Date()
    };
```
*   **Data Sanitization:** Notice how we don't just dump the entire `cart` array into the database. We map over it and extract *only* what we need (ID, name, quantity, price). If the cart array contained unnecessary UI state (like `isSelected: true`), we strip it out here to keep our database lightweight.

### 3. Executing the Transaction
```javascript
    await req.db.collection('transactions').insertOne(transactionRecord);
    
    // (Optional Phase II Logic: Loop through items and deduct stock from 'medicines' collection here)
    
    res.status(201).json({ message: 'Transaction Successful' });
  } catch (error) {
    res.status(500).json({ error: 'Transaction Failed' });
  }
});
```

**Summary for Judges:**
*"Our transaction route is highly sanitized. When the checkout payload arrives, Node.js extracts the critical spatial anchor—the Zip Code—and binds it to the financial ledger record. This specific route is the foundational data pipeline that will power our Phase II predictive heatmaps."*
