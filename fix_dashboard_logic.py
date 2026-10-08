import os

filepath = 'frontend/src/pages/Dashboard.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we import pythonApi
if 'pythonApi' not in content:
    content = content.replace("import api from '../api';", "import api, { pythonApi } from '../api';")

# Replace naive lowStock calculation with Python AI logic
old_fetch = """      try {
        const medRes = await api.get("/api/medicines");
        setMedicines(medRes.data);
        
        // Calculate low stock items (less than 10 units)
        const lowStock = medRes.data.filter(m => m.stock > 0 && m.stock < 10);
        setLowStockMeds(lowStock);"""

new_fetch = """      try {
        const medRes = await api.get("/api/medicines");
        setMedicines(medRes.data);
        
        // Use exact same AI Analytics as Insights page for 100% consistency
        try {
          const aiRes = await pythonApi.get("/api/analytics/sales");
          const restockRecs = aiRes.data.filter(a => a.restockRecommended);
          setLowStockMeds(restockRecs);
        } catch (aiErr) {
          console.error("AI service unreachable, using fallback", aiErr);
          setLowStockMeds(medRes.data.filter(m => m.stock <= 10));
        }"""

content = content.replace(old_fetch, new_fetch)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Dashboard updated with perfectly consistent AI logic!")
