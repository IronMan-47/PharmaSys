# Backend Training - Part 3: The Medicines API (CRUD)

Inside `routes/medicines.js`, we define the RESTful API endpoints that allow React to Create, Read, Update, and Delete inventory.

### 1. Fetching Inventory (READ)
```javascript
router.get('/', async (req, res) => {
  try {
    const medicines = await req.db.collection('medicines').find().toArray();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
```
*   **`try/catch`**: Database calls can fail (e.g., internet goes down). If we didn't have `catch`, Node.js would crash completely. `catch` intercepts the error and safely sends a `500 Server Error` back to React.
*   **`.find().toArray()`**: Calling `.find()` on MongoDB returns a "cursor" (a pointer to the data). Calling `.toArray()` forces the driver to fetch all the documents and convert them into a raw JavaScript array, which we send back via `res.json()`.

### 2. Adding New Stock (CREATE)
```javascript
router.post('/', async (req, res) => {
  try {
    const newMedicine = req.body;
    // Add a server-side timestamp
    newMedicine.createdAt = new Date();
    
    await req.db.collection('medicines').insertOne(newMedicine);
    res.status(201).json({ message: 'Medicine added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```
*   **Trusting the Server:** Notice how we generate `createdAt = new Date()` on the server, not the frontend. Never trust the client's clock, as it can be easily manipulated.
*   **`.insertOne()`**: The Native Driver command to push a single JSON document into the collection.
*   **`201` Status:** In HTTP REST standards, `200` means "OK", but `201` specifically means "Created".

### 3. Deleting Stock (DELETE)
```javascript
const { ObjectId } = require('mongodb');

router.delete('/:id', async (req, res) => {
  try {
    const medId = req.params.id;
    await req.db.collection('medicines').deleteOne({ _id: new ObjectId(medId) });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    // ...
  }
});
```
*   **`req.params.id`**: When the route is `/:id` and React hits `/api/medicines/12345`, `req.params.id` captures the string "12345".
*   **`new ObjectId()`**: MongoDB automatically generates unique IDs. However, these are not standard strings; they are BSON ObjectIds. Before we can search for one, we must wrap the string inside `new ObjectId()` to cast it to the correct datatype.

**Summary for Judges:**
*"Our medicines API utilizes standard REST verbs. We wrap all asynchronous database interactions in try/catch blocks to prevent unhandled promise rejections from crashing the Node process. For queries, we cast incoming URL parameters into MongoDB ObjectIds to natively execute .deleteOne() and .insertOne() operations."*
