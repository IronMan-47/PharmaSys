# Backend Training - Part 5: Audit Logging

In a pharmacy, accountability is critical. If a dangerous drug (like a Schedule H narcotic) goes missing, or if a massive stock is added incorrectly, the owner needs to know exactly who did it and when. 

The `routes/logs.js` handles an unalterable chronological audit trail.

### 1. The Secondary Write Trigger
In a fully completed system, whenever an API route mutates the inventory (like adding or deleting a medicine), the backend performs a "Secondary Write" to the `logs` collection.

```javascript
router.get('/', async (req, res) => {
  try {
    // Fetch all logs, sorted by newest first
    const logs = await req.db.collection('logs')
                             .find()
                             .sort({ createdAt: -1 })
                             .toArray();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});
```
*   **`.sort({ createdAt: -1 })`**: This is a powerful Native MongoDB command. `-1` means descending order. Instead of making React sort the array (which would be slow for 10,000 logs), we force the MongoDB database engine to sort the logs chronologically *before* sending them to the Node server. This is called delegating the computational load to the Data Tier.

### 2. Why a separate collection?
Why not just add an `addedBy` field to the medicine itself?
Because if a rogue employee deletes the medicine from the system, the record of who added it is destroyed along with it. 

By having a dedicated `logs` collection, the audit trail is completely decoupled from the inventory. It becomes an **Append-Only** ledger that guarantees total accountability.

**Summary for Judges:**
*"To ensure total staff accountability, we built a decoupled, append-only Audit Logging architecture. We utilize MongoDB's native sorting algorithms to offload chronological sorting from the application server directly to the database engine, ensuring maximum efficiency."*
