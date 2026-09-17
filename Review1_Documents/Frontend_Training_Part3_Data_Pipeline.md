# Frontend Training - Part 3: The Data Pipeline & Client-Side Search

Our React frontend is entirely separate from our Node.js backend. They must communicate over HTTP, which introduces network latency. We heavily optimized this pipeline.

### The Danger of Infinite Loops (`useEffect`)
When the Inventory screen loads, it needs to automatically fetch medicines from the database. We use the `useEffect` lifecycle hook to run this side-task.

However, because `useEffect` runs after every screen render, and fetching data *causes* a screen render, doing this incorrectly creates an infinite loop that will instantly DDoS the backend server. We prevent this by providing an empty dependency array `[]` to the hook, which explicitly commands React to treat the fetch as an "on-mount only" initialization sequence.

### Zero-Latency Client-Side Filtering
The defining feature of our Inventory page is its speed. Traditional search bars send an API `GET` request to the backend every single time the user presses a key. If they type "Paracetamol", that's 11 separate database queries, causing immense lag and server strain.

We completely inverted this model.
When the component mounts, we download the *entire* medicine catalog from MongoDB directly into the browser's local RAM. As the user types, we use JavaScript's native `.filter()` array method to sift through the RAM.

```javascript
medicines.filter((med) => med.name.includes(searchTerm));
```
By pushing the computational load onto the client's CPU, the search results filter in under 5 milliseconds with absolute zero network overhead.

**Summary for Judges:**
*"To optimize the POS workflow, we implemented Client-Side Filtering. Rather than overwhelming our MongoDB cluster with heavy regex queries on every keystroke, we fetch the entire dataset into local state upon component mount. We then utilize native array filtering algorithms on the client's CPU, resulting in a zero-latency search experience with zero network overhead."*
