import os
import re

# 1. Update Dashboard.jsx (PDF Generator)
dashboard_path = 'frontend/src/pages/Dashboard.jsx'
with open(dashboard_path, 'r', encoding='utf-8') as f:
    d_content = f.read()

pdf_target = "doc.text(`Location Zip: ${customerInfo.zipCode || 'N/A'}`, 14, 48);"
pdf_replacement = "doc.text(`Location Zip: ${customerInfo.zipCode || 'N/A'}`, 14, 48);\n      doc.text(`Condition: ${customerInfo.condition || 'Not Entered'}`, 14, 54);"

if pdf_target in d_content and 'doc.text(`Condition' not in d_content:
    d_content = d_content.replace(pdf_target, pdf_replacement)
    
    # We also need to adjust the starting Y coordinate of the table since we added a new line
    # The autoTable starts at startY: 55 usually
    d_content = d_content.replace('startY: 55,', 'startY: 62,')
    
    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.write(d_content)
    print("Updated Dashboard.jsx PDF logic")


# 2. Update Sales.jsx (UI Display)
sales_path = 'frontend/src/pages/Sales.jsx'
with open(sales_path, 'r', encoding='utf-8') as f:
    s_content = f.read()

sales_target = """                {tx.zipCode && tx.zipCode !== 'Unknown' && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {tx.zipCode}
                  </div>
                )}"""

sales_replacement = sales_target + """
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-medium mr-1">Condition:</span> 
                  <span className={tx.condition ? "text-red-500 dark:text-red-400 font-medium" : ""}>
                    {tx.condition || 'Not Entered'}
                  </span>
                </div>"""

if 'Condition:' not in s_content:
    s_content = s_content.replace(sales_target, sales_replacement)
    with open(sales_path, 'w', encoding='utf-8') as f:
        f.write(s_content)
    print("Updated Sales.jsx UI logic")
