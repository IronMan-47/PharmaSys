import json
import re
import glob

def fix_dashboard():
    filepath = 'frontend/src/pages/Dashboard.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to wrap specific loose strings with {t("...")}
    replaces = {
        '>Overview and active billing calculator.<': '>{t("Overview and active billing calculator.")}<',
        '>Recent Sales<': '>{t("Recent Sales")}<',
        '>Transactions processed recently<': '>{t("Transactions processed recently")}<',
        '> Items<': '> {t("Items")}<',
        '>Need immediate restock<': '>{t("Need immediate restock")}<',
        '>Search & Add Items<': '>{t("Search & Add Items")}<',
        'placeholder="Search inventory by name to add to cart..."': 'placeholder={t("Search inventory by name to add to cart...")}',
        '>All<': '>{t("All")}<',
        '>Human<': '>{t("Human")}<',
        '>Animal<': '>{t("Animal")}<',
        '>Stock: ': '>{t("Stock")}: ',
        'Current Order': '{t("Current Order")}',
        'CUSTOMER DETAILS (OPTIONAL)': '{t("CUSTOMER DETAILS (OPTIONAL)")}',
        'Customer Details (Optional)': '{t("CUSTOMER DETAILS (OPTIONAL)")}',
        '>Customer Details \n(Optional)<': '>{t("CUSTOMER DETAILS (OPTIONAL)")}<',
    }

    # Special handling for Current order which might be plain text next to an icon
    content = content.replace('\n                  Current Order\n', '\n                  {t("Current Order")}\n')
    content = content.replace('>Current Order</h3>', '>{t("Current Order")}</h3>')
    
    # Customer Details which has a line break in the original code
    content = content.replace('Customer Details \n(Optional)', '{t("CUSTOMER DETAILS (OPTIONAL)")}')
    content = content.replace('Customer Details (Optional)', '{t("CUSTOMER DETAILS (OPTIONAL)")}')

    for k, v in replaces.items():
        content = content.replace(k, v)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Updated Dashboard.jsx")

def fix_i18n():
    filepath = 'frontend/src/i18n.js'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    en_additions = """
      "Overview and active billing calculator.": "Overview and active billing calculator.",
      "Recent Sales": "Recent Sales",
      "Transactions processed recently": "Transactions processed recently",
      "Items": "Items",
      "Need immediate restock": "Need immediate restock",
      "Search & Add Items": "Search & Add Items",
      "Search inventory by name to add to cart...": "Search inventory by name to add to cart...",
      "All": "All",
      "Human": "Human",
      "Animal": "Animal",
      "Stock": "Stock",
      "CUSTOMER DETAILS (OPTIONAL)": "CUSTOMER DETAILS (OPTIONAL)",
    """

    hi_additions = """
      "Overview and active billing calculator.": "विहंगावलोकन और सक्रिय बिलिंग कैलकुलेटर।",
      "Recent Sales": "हाल की बिक्री",
      "Transactions processed recently": "हाल ही में प्रोसेस किए गए लेनदेन",
      "Items": "आइटम",
      "Need immediate restock": "तुरंत रेस्टॉक की आवश्यकता है",
      "Search & Add Items": "खोजें और आइटम जोड़ें",
      "Search inventory by name to add to cart...": "कार्ट में जोड़ने के लिए नाम से इन्वेंटरी खोजें...",
      "All": "सभी",
      "Human": "इंसान",
      "Animal": "जानवर",
      "Stock": "स्टॉक",
      "CUSTOMER DETAILS (OPTIONAL)": "ग्राहक विवरण (वैकल्पिक)",
    """

    # Insert into English block
    content = content.replace('"Dashboard": "Dashboard & POS",', '"Dashboard": "Dashboard & POS",\n' + en_additions)
    # Insert into Hindi block
    content = content.replace('"Dashboard": "डैशबोर्ड और पीओएस",', '"Dashboard": "डैशबोर्ड और पीओएस",\n' + hi_additions)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Updated i18n.js")

if __name__ == "__main__":
    fix_dashboard()
    fix_i18n()
