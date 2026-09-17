const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function run() {
  try {
    await client.connect();
    db = client.db("pharmacy_v2");
    console.log("Connected successfully to MongoDB");
    
    // Pass db to routes
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    const { authenticate } = require('./middleware/authMiddleware');

    // Public route
    app.use('/api/auth', require('./routes/auth'));

    // Protected routes
    app.use('/api/medicines', authenticate, require('./routes/medicines'));
    app.use('/api/transactions', authenticate, require('./routes/transactions'));
    app.use('/api/logs', authenticate, require('./routes/logs'));
    app.use('/api/pharmai', authenticate, require('./routes/pharmai'));

    app.get('/', (req, res) => {
      res.send('Pharmacy V2 API is running');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);
