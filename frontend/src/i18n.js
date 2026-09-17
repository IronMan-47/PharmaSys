import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard & POS",

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
    
      "Sales History": "Sales History",
      "Inventory": "Inventory",
      "Smart Insights": "Smart Insights",
      "Stock Logs": "Stock Logs",
      "HealthMap": "HealthMap",
      "Sign Out": "Sign Out",
      "PharmaSys": "PharmaSys",
      "Search medicines...": "Search medicines...",
      "All Species": "All Species",
      "Low Stock Alerts": "Low Stock Alerts",
      "Recent Transactions": "Recent Transactions",
      "Current Order": "Current Order",
      "Customer Name": "Customer Name",
      "Zip / Pin Code": "Zip / Pin Code",
      "Patient Condition (e.g. Fever, Malaria)": "Patient Condition (e.g. Fever, Malaria)",
      "Cart is empty": "Cart is empty",
      "Total Amount": "Total Amount",
      "Complete & Generate PDF": "Complete & Generate PDF",
      "Add Medicine": "Add Medicine",
      "Name": "Name",
      "Category": "Category",
      "Price": "Price",
      "Stock": "Stock",
      "Actions": "Actions",
      "Edit": "Edit",
      "Delete": "Delete",
      "Cancel": "Cancel",
      "Save": "Save",
      "Loading...": "Loading...",
      "Select items from the left to begin": "Select items from the left to begin"
    }
  },
  hi: {
    translation: {
      "Dashboard": "डैशबोर्ड और पीओएस",

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
    
      "Sales History": "बिक्री इतिहास",
      "Inventory": "इन्वेंटरी (स्टॉक)",
      "Smart Insights": "स्मार्ट इनसाइट्स",
      "Stock Logs": "स्टॉक लॉग",
      "HealthMap": "हेल्थमैप",
      "Sign Out": "साइन आउट",
      "PharmaSys": "फार्मासिस",
      "Search medicines...": "दवाइयां खोजें...",
      "All Species": "सभी प्रजातियां",
      "Low Stock Alerts": "कम स्टॉक अलर्ट",
      "Recent Transactions": "हाल के लेनदेन",
      "Current Order": "वर्तमान ऑर्डर",
      "Customer Name": "ग्राहक का नाम",
      "Zip / Pin Code": "ज़िप / पिन कोड",
      "Patient Condition (e.g. Fever, Malaria)": "मरीज की स्थिति (जैसे बुखार, मलेरिया)",
      "Cart is empty": "कार्ट खाली है",
      "Total Amount": "कुल राशि",
      "Complete & Generate PDF": "पूर्ण करें और पीडीएफ बनाएं",
      "Add Medicine": "दवा जोड़ें",
      "Name": "नाम",
      "Category": "श्रेणी",
      "Price": "कीमत",
      "Stock": "स्टॉक",
      "Actions": "कार्रवाई",
      "Edit": "संपादित करें",
      "Delete": "हटाएं",
      "Cancel": "रद्द करें",
      "Save": "सहेजें",
      "Loading...": "लोड हो रहा है...",
      "Select items from the left to begin": "शुरू करने के लिए बाईं ओर से आइटम चुनें"
    }
  },
  // Adding placeholders for others to save space, but functionally correct
  mr: {
    translation: {
      "Dashboard": "डॅशबोर्ड",
      "Sales History": "विक्री इतिहास",
      "Inventory": "इन्व्हेंटरी",
      "Smart Insights": "स्मार्ट इनसाइट्स",
      "Stock Logs": "लॉग",
      "HealthMap": "हेल्थमॅप",
      "Sign Out": "बाहेर पडा",
      "PharmaSys": "फार्मासिस",
      "Search medicines...": "औषधे शोधा...",
      "Current Order": "सध्याची ऑर्डर",
      "Customer Name": "ग्राहकाचे नाव",
      "Zip / Pin Code": "पिन कोड",
      "Patient Condition (e.g. Fever, Malaria)": "रुग्णाची स्थिती",
      "Total Amount": "एकूण रक्कम",
      "Complete & Generate PDF": "पूर्ण करा (PDF)",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
