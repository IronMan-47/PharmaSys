import requests
import random
import time
from pymongo import MongoClient

# Use the exact DB connection string the user has
MONGO_URI = "mongodb://khareb1981_db_user:4PoB07Lwo3z8aLuv@ac-hie9gxs-shard-00-00.ichjljf.mongodb.net:27017,ac-hie9gxs-shard-00-01.ichjljf.mongodb.net:27017,ac-hie9gxs-shard-00-02.ichjljf.mongodb.net:27017/pharmacy_v2?ssl=true&authSource=admin&retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client['pharmacy_v2']
transactions_col = db['transactions']

states_zips = {
    '11': ['110001', '110020'], # Delhi
    '40': ['400001', '400050'], # Maharashtra
    '46': ['462001', '462022'], # Madhya Pradesh
    '56': ['560001', '560020'], # Karnataka
    '60': ['600001', '600028'], # Tamil Nadu
    '80': ['800001', '800020'], # Bihar
    '30': ['302001', '302015'], # Rajasthan
    '70': ['700001', '700020'], # West Bengal
    '38': ['380001', '380020'], # Gujarat
}

conditions = ['Fever', 'Fever', 'Fever', 'Malaria', 'Malaria', 'Dengue', 'Typhoid', 'Covid']

# Generate 300 random transactions to light up the map
print("Seeding epidemiological data...")

new_txs = []
for _ in range(300):
    state_prefix = random.choice(list(states_zips.keys()))
    zip_code = random.choice(states_zips[state_prefix])
    condition = random.choice(conditions)
    
    # Overweight Fever in MP and Maharashtra for a "heatmap hotspot" effect
    if state_prefix in ['46', '40'] and random.random() > 0.5:
        condition = 'Fever'
    
    new_txs.append({
        "items": [{"medicineId": "651abc123456789012345678", "name": "Paracetamol", "quantity": 1, "price": 25}],
        "totalAmount": 25,
        "customerName": "Demo Patient",
        "zipCode": zip_code,
        "condition": condition,
        "createdAt": "2024-03-24T10:00:00.000Z"
    })

transactions_col.insert_many(new_txs)
print(f"Inserted {len(new_txs)} transactions! HealthMap is now fully populated.")
