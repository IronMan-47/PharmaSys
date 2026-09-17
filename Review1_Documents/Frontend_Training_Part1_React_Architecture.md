# Frontend Training - Part 1: The React Architecture (SPA & Virtual DOM)

To defend this project, you must first explain *why* we chose React over traditional HTML/CSS development. The answer comes down to two major architectural concepts: Single Page Applications (SPA) and the Virtual DOM.

### The Single Page Application (SPA)
In the 2000s, websites operated on a Multi-Page Architecture. If a user clicked a link, the browser sent a request to the server, downloaded a completely new HTML file, and the screen flashed white while loading it. For a high-speed pharmacy POS system handling a rush of customers, this network latency is unacceptable.

PharmaSys is an **SPA**. There is literally only one HTML file (`index.html`). 
We use a library called `react-router-dom` to intercept the user's clicks. When the pharmacist clicks "Inventory", the browser does not talk to the server. React simply uses JavaScript to erase the dashboard and draw the inventory instantly.

### The Virtual DOM
In vanilla JavaScript, updating the screen requires manually finding the HTML element and changing it, which is incredibly slow for large lists.

React creates a "Virtual DOM"—a lightweight, invisible copy of the screen stored in RAM. When data changes, React redraws the invisible copy first, compares it to the real screen, mathematically calculates the exact pixels that are different, and ONLY updates those specific pixels. This is what allows our POS cart to calculate totals instantly without the webpage freezing.

**Summary for Judges:**
*"To guarantee maximum speed and zero network latency during billing operations, PharmaSys is engineered as a Single Page Application using React. By utilizing client-side routing, we eliminate server page reloads entirely. Furthermore, React's Virtual DOM ensures that when a transaction occurs, only the modified components are dynamically re-rendered, preserving CPU performance."*
