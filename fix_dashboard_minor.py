import os
import re

filepath = 'frontend/src/pages/Dashboard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix total transactions number
content = content.replace('{recentTransactions.length}', '{totalTransactions}')

# In fetchData, we need to set totalTransactions
# Let's find setRecentTransactions(transRes.data.slice(0, 5));
# And add setTotalTransactions(transRes.data.length);
if 'const [totalTransactions, setTotalTransactions] = useState(0);' not in content:
    content = content.replace('const [recentTransactions, setRecentTransactions] = useState([]);',
                              'const [recentTransactions, setRecentTransactions] = useState([]);\n  const [totalTransactions, setTotalTransactions] = useState(0);')

content = content.replace('setRecentTransactions(transRes.data.slice(0, 5));',
                          'setRecentTransactions(transRes.data.slice(0, 5));\n      setTotalTransactions(transRes.data.length);')

# Now add back the classes to the inputs
# Search for the customer details inputs and add the class back
class_str = 'className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"'

content = re.sub(
    r'(<input\s+type="text"\s+placeholder=\{t\("Customer Name"\)\}\s+value=\{customerInfo\.name\}\s+onChange=\{[^}]*\}\s+)(/>)',
    r'\1 ' + class_str + r' \2',
    content
)

content = re.sub(
    r'(<input\s+type="text"\s+placeholder=\{t\("Zip / Pin Code"\)\}\s+value=\{customerInfo\.zipCode\}\s+onChange=\{[^}]*\}\s+)(/>)',
    r'\1 ' + class_str + r' \2',
    content
)

content = re.sub(
    r'(<input\s+type="text"\s+placeholder=\{t\("Patient Condition[^"]*"\)\}\s+value=\{customerInfo\.condition\}\s+onChange=\{[^}]*\}\s+)(/>)',
    r'\1 ' + class_str + r' \2',
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixes applied successfully!")
