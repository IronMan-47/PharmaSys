# Backend Training - Part 2: Authentication & JWT

Our authentication system inside `routes/auth.js` is entirely **Stateless**. This means the server does not remember who is logged in. It relies purely on cryptographic signatures.

### 1. Receiving the Login Request
```javascript
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
```
When React sends a POST request to `/api/auth/login`, it includes a JSON body with the username and password. Because of the `express.json()` middleware from Part 1, we can destructure them directly from `req.body`.

### 2. Querying the Database
```javascript
  const user = await req.db.collection('users').findOne({ username });
```
Here, we use the injected `req.db` to search the `users` collection. `.findOne()` is a Native MongoDB method that returns the first document matching our query, or `null` if the user doesn't exist.

### 3. Password Verification & Token Generation
```javascript
  if (user && user.password === password) {
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
```
*   **The Check:** We check if the user exists AND if the password matches. (In a production system, we would hash the password with `bcrypt`, but for Review 1, plaintext verification is acceptable).
*   **The Token:** If successful, we call `jwt.sign()`. We pack the user's ID and Role inside the token. 
*   **The Secret:** `process.env.JWT_SECRET` is a massive cryptographic password stored on the server. Because only the server knows this secret, nobody can forge a fake token.
*   **The Expiration:** We set it to expire in 8 hours (a typical pharmacist shift).

**Summary for Judges:**
*"When a pharmacist logs in, the Node server queries the native MongoDB users collection. If verified, it signs a JWT using a server-side cryptographic secret. This token is handed back to React. Because the token contains the user's ID and is self-verifying, our server remains completely stateless, drastically reducing RAM overhead."*
