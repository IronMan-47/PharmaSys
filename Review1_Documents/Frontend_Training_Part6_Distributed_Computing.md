# Frontend Training - Part 6: Distributed Computing (PDFs)

A Point-of-Sale checkout sequence requires heavy mathematical computation (aggregating totals) and heavy graphical rendering (drawing PDF receipts). 

### Functional Array Aggregation
As the user adds and removes items from the cart, the total bill must instantly recalculate. Using traditional `for` loops is verbose and prone to scope errors. 

We utilized the JavaScript `.reduce()` array method. This functional programming algorithm takes the entire cart array and cleanly "reduces" it down to a single mathematical integer by sequentially multiplying the price by the quantity of every item. It fires dynamically on every state change, ensuring flawless billing accuracy.

### Offloading Server Load (Client-Side PDF)
In legacy architectures, when a pharmacist requests a PDF receipt, the backend Node.js server has to boot up a heavy graphics library, calculate the page layout, draw the PDF, save it to disk, and transmit it over the internet. If a busy pharmacy processes 100 checkouts an hour, this will completely bottleneck the server's CPU.

We inverted this paradigm using a library called `jsPDF`. 
When the user clicks "Complete Purchase", the backend only processes the lightweight JSON data. The React frontend, however, takes the local cart array and forces the **user's own computer processor (the client CPU)** to draw the PDF canvas and trigger the download locally.

**Summary for Judges:**
*"We heavily focused on distributed computing for our POS checkout. Instead of taxing our Node server to calculate totals and generate PDF receipts, we utilize functional array methods to aggregate revenue dynamically on the frontend. We then invoke `jsPDF` to render the receipt entirely on the client's local CPU, reducing our backend billing load to absolute zero and ensuring offline reliability."*
