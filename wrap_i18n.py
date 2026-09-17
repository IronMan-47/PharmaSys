import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for UI text
    replacements = {
        '>Dashboard & POS<': '>{t("Dashboard")}<',
        '>Sales History<': '>{t("Sales History")}<',
        '>Inventory<': '>{t("Inventory")}<',
        '>Smart Insights<': '>{t("Smart Insights")}<',
        '>Stock Logs<': '>{t("Stock Logs")}<',
        '>HealthMap<': '>{t("HealthMap")}<',
        'placeholder="Search medicines..."': 'placeholder={t("Search medicines...")}',
        '>All Species<': '>{t("All Species")}<',
        '>Low Stock Alerts<': '>{t("Low Stock Alerts")}<',
        '>Recent Transactions<': '>{t("Recent Transactions")}<',
        '>Current Order<': '>{t("Current Order")}<',
        'placeholder="Customer Name"': 'placeholder={t("Customer Name")}',
        'placeholder="Zip / Pin Code"': 'placeholder={t("Zip / Pin Code")}',
        'placeholder="Patient Condition (e.g. Fever, Malaria)"': 'placeholder={t("Patient Condition (e.g. Fever, Malaria)")}',
        '>Cart is empty<': '>{t("Cart is empty")}<',
        '>Total Amount<': '>{t("Total Amount")}<',
        '>Complete & Generate PDF<': '>{t("Complete & Generate PDF")}<',
        '>Select items from the left to begin<': '>{t("Select items from the left to begin")}<'
    }
    
    new_content = content
    for pattern, repl in replacements.items():
        new_content = new_content.replace(pattern, repl)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Translated text in {filepath}")

if __name__ == "__main__":
    files = glob.glob('frontend/src/pages/*.jsx')
    for f in files:
        process_file(f)
