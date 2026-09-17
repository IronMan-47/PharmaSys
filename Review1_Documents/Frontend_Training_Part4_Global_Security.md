# Frontend Training - Part 4: Global Security & The Context API

Authentication in modern React apps requires securing not just the backend routes, but the actual frontend UI components.

### The Problem: Prop Drilling
When a user logs in on the `Login.jsx` page, that specific page receives the JWT authentication token. But how does the `Sidebar.jsx` component know to change the UI from "Login" to "Logout"? 

If we manually pass the token down from component to component through the tree, the code becomes incredibly fragile and messy—an anti-pattern known as "Prop Drilling".

### The Solution: Global State Bubbles
Instead of passing data down, we implemented React's **Context API**. 
Think of Context as a massive, invisible bubble that wraps around the entire application. When the user successfully logs in, we inject their JWT token directly into this bubble. 

Now, any component anywhere in the application can simply "reach up" into the bubble and instantly verify if the user is authenticated. 

### Hardening the DOM (Protected Routes)
To ensure absolute security, we built a structural gatekeeper called a `<ProtectedRoute>`. In our routing file, we wrapped the Dashboard and Inventory screens inside this gatekeeper. 

Before React is allowed to draw those screens, the gatekeeper checks the global Context bubble. If the JWT token is missing or expired, the gatekeeper violently intercepts the render and redirects the user back to the login screen, effectively locking down the DOM.

**Summary for Judges:**
*"To manage authentication securely without introducing prop-drilling anti-patterns, we implemented the React Context API for centralized global state. Our router architecture is wrapped in strict Protected Routes that intercept unauthenticated access at the DOM level, ensuring secure, token-based session management across the entire SPA."*
