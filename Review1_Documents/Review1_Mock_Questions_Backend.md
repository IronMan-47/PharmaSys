# Review 1: EXHAUSTIVE Mock Viva Questions - Backend & Database

*Use the "Simple Explanation" to understand the concept yourself, and memorize the "Exhaustive Answer" for the judges.*

---

## 1. Native MongoDB Driver vs Mongoose ORM
**The Judge asks:** *"Most students use Mongoose to connect to MongoDB. I see you are using the raw MongoDB driver. Why did you choose this over an ORM?"*

**The Code on your screen:**
```javascript
// We do this:
await req.db.collection('medicines').insertOne(newMedicine);

// Instead of this (Mongoose):
// const med = new Medicine(data); await med.save();
```

**My Simple Explanation (For YOU):**
Mongoose is like hiring a strict translator. It makes sure everything is perfectly formatted, but it takes extra time. For a billing system where speed is everything, we fire Mongoose and talk directly to the database. It’s faster, raw, and lets us easily throw weird datasets (like animal drugs) into the database without the translator complaining about missing fields.

**Your Exhaustive Answer (For the JUDGE):**
> *"Sir/Ma'am, while Mongoose provides strict schemas, it introduces a massive layer of abstraction that heavily degrades read/write speeds. *
> 
> *For a Point-of-Sale (POS) system handling high-volume checkout transactions, raw query speed is our absolute top priority. By bypassing Mongoose and executing queries directly through the Native MongoDB Driver, we strip away all abstraction overhead. Furthermore, MongoDB is inherently a NoSQL database; using the native driver allows us to fully leverage its schema-less flexibility to ingest unstructured real-world datasets—like the Tata 1mg medicine database—without writing complex schema normalizations."*

---

## 2. Stateless Authentication (JWTs vs Sessions)
**The Judge asks:** *"Explain your authentication flow. Why are you using JSON Web Tokens (JWT) instead of standard Server-Side Sessions?"*

**The Code on your screen:**
```javascript
const token = jwt.sign(
  { userId: user._id, role: user.role }, 
  'your_jwt_secret', 
  { expiresIn: '8h' }
);
res.json({ token });
```

**My Simple Explanation (For YOU):**
Think of Server-Side Sessions like a waiter memorizing every customer's face. If 1,000 customers come in, the waiter's brain (RAM) explodes. JWT is like handing the customer a crypto ID badge. The waiter forgets the customer immediately. When the customer wants something, they just show the badge. The server doesn't waste memory remembering people.

**Your Exhaustive Answer (For the JUDGE):**
> *"Sir/Ma'am, Server-Side Sessions are **Stateful**. This means our Node.js server would have to allocate RAM to memorize the session ID of every single logged-in pharmacist. If this scales across hundreds of clinics, our server memory will overload and crash.*
> 
> *By using JWTs, our Node backend becomes completely **Stateless**. When a user logs in, the server cryptographically signs a token and hands it to the client. The server then immediately forgets the user exists. On the next API request, the server simply inspects the cryptographic signature on the token. If it's valid, it processes the request. This eliminates database lookups for authentication, making our API exceptionally fast and infinitely scalable."*

---

## 3. The Node.js Event Loop (Why Node?)
**The Judge asks:** *"Why did you choose Node.js for the backend instead of Python or Java?"*

**My Simple Explanation (For YOU):**
Java creates a new heavy "thread" (worker) for every person visiting the site. If 100 people visit, Java creates 100 workers. Node.js only has ONE worker, but it's incredibly fast. Instead of waiting for a database to load, the single worker sends the request to the database and immediately helps the next person. When the database is done, the worker comes back to it.

**Your Exhaustive Answer (For the JUDGE):**
> *"Sir/Ma'am, traditional servers like Java are Multi-Threaded. If 100 pharmacists request inventory at the same time, Java creates 100 heavy threads and blocks execution while waiting for the database to reply, which eats up massive amounts of CPU and RAM.*
> 
> *Node.js operates on a single-threaded **Asynchronous, Non-Blocking Event Loop**. When Node asks MongoDB for data, it does not wait around—it immediately moves on to handle the next pharmacist's HTTP request. When the database finally replies, Node fires a callback to send the data back to the user. This non-blocking I/O model makes Node.js incredibly lightweight, allowing us to handle thousands of concurrent POS transactions on very cheap server hardware."*

---

## 4. RESTful API Architecture
**The Judge asks:** *"You claim this is a REST API. Point to your code and explain what makes it RESTful."*

**The Code on your screen:**
```javascript
router.get('/', async (req, res) => { ... });       // Fetch all
router.post('/', async (req, res) => { ... });      // Create new
router.delete('/:id', async (req, res) => { ... }); // Delete one
```

**My Simple Explanation (For YOU):**
REST just means we use standard, clean web commands (GET, POST, DELETE) targeting a single URL (like `/medicines`). We don't make messy URLs like `/deleteMedicine` or `/getMedicine`. We just send a `DELETE` command to `/medicines` and the server knows exactly what to do.

**Your Exhaustive Answer (For the JUDGE):**
> *"Sir/Ma'am, REST (Representational State Transfer) means we map standard HTTP verbs to CRUD operations using clean, predictable endpoints. *
> 
> *Instead of having messy URLs like `/getMedicines` or `/deleteMedicine`, we use a single resource endpoint: `/api/medicines`. *
> *If the frontend sends a `GET` request to that endpoint, it reads the data.*
> *If it sends a `POST` request, it creates data.*
> *If it sends a `DELETE` request with an ID parameter, it destroys data.*
> *This standardization means that in Phase 2, if we build a mobile app, it can interact with our exact same backend predictably without us changing a single line of server code."*

---

## 5. Database Connection Pooling (Middleware)
**The Judge asks:** *"Show me your `server.js`. Are you opening a new database connection every time someone hits an API route?"*

**The Code on your screen:**
```javascript
// Connect ONCE when server starts
const client = await MongoClient.connect(process.env.MONGO_URI);
const db = client.db('pharmasys');

// Inject the active connection into EVERY request
app.use((req, res, next) => {
  req.db = db;
  next();
});
```

**My Simple Explanation (For YOU):**
Connecting to a database is like dialing a phone number; it takes a few seconds to connect. If we dialed the phone number every time a user clicked a button, the app would lag horribly. Instead, when the server starts, we dial the number ONCE, keep the phone off the hook permanently, and just shout messages into it using `req.db`.

**Your Exhaustive Answer (For the JUDGE):**
> *"No sir/ma'am, establishing a new TCP connection to the database for every single HTTP request would create a massive bottleneck and crash MongoDB under load.*
> 
> *Instead, we implemented **Database Connection Pooling**. When `server.js` boots up, it connects to MongoDB exactly once. We then wrote a custom Express Middleware (`app.use`). Every time an API request comes in, this middleware intercepts it, injects that single, active, high-speed database connection into the `req.db` object, and passes it down the chain (`next()`). This ensures maximum throughput with minimal resource overhead."*

---

## 6. Async/Await & Error Handling
**The Judge asks:** *"Why is every single route in your backend wrapped in `try/catch` blocks? What happens if you remove them?"*

**The Code on your screen:**
```javascript
router.post('/', async (req, res) => {
  try {
    const transaction = req.body;
    await req.db.collection('transactions').insertOne(transaction);
    res.status(201).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**My Simple Explanation (For YOU):**
When you talk to a database over the internet, sometimes the internet cuts out. If it cuts out and you don't have a `try/catch` block, Node.js panics and literally shuts down the entire server, breaking the app for everyone. The `try/catch` block is a safety net. It says, "If the internet cuts out, just send a safe error message to the user, but keep the server running."

**Your Exhaustive Answer (For the JUDGE):**
> *"Sir/Ma'am, database operations take time and are prone to network failures. Therefore, they are **Asynchronous**. We use the `await` keyword to pause the execution of the route until MongoDB finishes writing the transaction.*
> 
> *If we remove the `try/catch` block and the database happens to go offline, the Node.js process will encounter an 'Unhandled Promise Rejection'. This is a fatal error that will instantly crash the entire backend server, taking the whole pharmacy offline. By wrapping it in a `try/catch`, we gracefully intercept the failure and return a `500 Internal Server Error` to the frontend, keeping the server alive to handle other requests."*
