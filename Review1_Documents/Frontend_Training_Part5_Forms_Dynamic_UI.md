# Frontend Training - Part 5: Controlled Forms & Dynamic UI

User input is highly unpredictable. React provides a strict methodology to ensure that the UI never falls out of sync with what the user is typing.

### Controlled Components
In a traditional HTML website, input forms possess their own internal memory. If a user types their name, the HTML stores it, and the developer has to actively query the DOM (`document.getElementById`) to extract it. This means the HTML is the source of truth.

In React, this is considered dangerous. We use **Controlled Components**. We forcibly bind the HTML input directly to a React `useState` variable. When the user presses a key on their keyboard, an event fires that updates the React state. The HTML input then reads its value *from* the state. 

React becomes the absolute Single Source of Truth. It is mathematically impossible for the form data to desynchronize from the application logic.

### Dynamic Conditional Rendering
A core requirement of our POS system was visual alerts, such as turning text red when stock drops below 10.

Instead of writing massive JavaScript functions to manually search for HTML elements and swap CSS classes, we injected **Ternary Operators** directly into the markup. 

```javascript
className={ med.stock < 10 ? 'text-red-600' : 'text-gray-600' }
```
This is the true power of React. Because this styling logic is tied directly to the state variable, the exact millisecond a purchase drops the stock count to 9, the Virtual DOM recalculates the equation and instantly turns the text red, requiring zero manual DOM manipulation.

**Summary for Judges:**
*"Our frontend relies heavily on Controlled Components, enforcing React state as the single source of truth for all user input to prevent data desynchronization. Furthermore, we utilize inline ternary operators for dynamic conditional rendering, allowing the UI to react instantly to state mutations without requiring expensive manual DOM queries."*
