# Backend Training - Part 1: Server Setup & MongoDB Native Driver

This is the foundation of our Node.js backend. In `server.js`, we initialize our Express server and connect to our MongoDB database. 

### 1. The Express Server & Middleware
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
```
*   **`express()`**: This creates our web server.
*   **`cors()`**: Cross-Origin Resource Sharing. Because our frontend runs on port `5173` and backend on `5001`, browsers will block them from talking to each other for security reasons. `cors()` disables this block so React can talk to Node.
*   **`express.json()`**: When React sends data (like a new medicine or login details), it sends it as a JSON string. This middleware automatically parses that string into a readable JavaScript object (`req.body`).

### 2. The Native MongoDB Connection Pool
Most tutorials use Mongoose. We explicitly bypassed it to maximize speed for our POS system.

```javascript
const { MongoClient } = require('mongodb');

let db; // Global variable to hold our connection

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('pharmasys');
  console.log('Connected to MongoDB via Native Driver');
}
connectDB();
```
*   **Why connect once?** Establishing a TCP connection to a database takes time. By running `connectDB()` exactly once when the server boots, we keep the connection open permanently (called Connection Pooling).

### 3. Dependency Injection Middleware
How do our routes (like `/api/medicines`) get access to this database connection? We inject it!

```javascript
app.use((req, res, next) => {
  req.db = db;
  next();
});
```
*   Every single time an HTTP request comes in, this block of code runs first. It attaches our active database connection to the `req` (request) object.
*   The `next()` function tells Express: *"I am done injecting the database, please pass this request to the actual route handler now."*

**Summary for Judges:**
*"Our server boots up and establishes a single, high-speed connection pool to MongoDB using the Native Driver. We use a custom middleware to inject this connection into the `req` object for every incoming HTTP request, ensuring maximum throughput and zero ORM overhead."*
