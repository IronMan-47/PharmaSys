import sys
import os
import random
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from bson import ObjectId

# Add parent directory to path to import database module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.mongodb import get_db, close_db

HUMAN_MEDS = [
    # Analgesics
    ("Paracetamol 500mg", "Analgesic", 45.50, "Paracetamol 500mg", "Human", "Tablet", 500),
    ("Paracetamol 650mg", "Analgesic", 50.00, "Paracetamol 650mg", "Human", "Tablet", 400),
    ("Ibuprofen 400mg", "Analgesic", 35.00, "Ibuprofen 400mg", "Human", "Tablet", 300),
    ("Ibuprofen 200mg", "Analgesic", 25.00, "Ibuprofen 200mg", "Human", "Tablet", 250),
    ("Diclofenac 50mg", "Analgesic", 40.00, "Diclofenac 50mg", "Human", "Tablet", 200),
    ("Tramadol 50mg", "Analgesic", 80.00, "Tramadol 50mg", "Human", "Capsule", 150),
    ("Aspirin 75mg", "Analgesic", 20.00, "Aspirin 75mg", "Human", "Tablet", 350),
    ("Aspirin 150mg", "Analgesic", 30.00, "Aspirin 150mg", "Human", "Tablet", 100),
    # Antibiotics
    ("Amoxicillin 500mg", "Antibiotic", 60.00, "Amoxicillin 500mg", "Human", "Capsule", 400),
    ("Amoxicillin 250mg", "Antibiotic", 40.00, "Amoxicillin 250mg", "Human", "Capsule", 200),
    ("Azithromycin 500mg", "Antibiotic", 120.00, "Azithromycin 500mg", "Human", "Tablet", 300),
    ("Azithromycin 250mg", "Antibiotic", 80.00, "Azithromycin 250mg", "Human", "Tablet", 150),
    ("Ciprofloxacin 500mg", "Antibiotic", 50.00, "Ciprofloxacin 500mg", "Human", "Tablet", 250),
    ("Levofloxacin 500mg", "Antibiotic", 70.00, "Levofloxacin 500mg", "Human", "Tablet", 200),
    ("Doxycycline 100mg", "Antibiotic", 45.00, "Doxycycline 100mg", "Human", "Capsule", 100),
    # Antacids / Gastrointestinal
    ("Pantoprazole 40mg", "Antacid", 55.00, "Pantoprazole 40mg", "Human", "Tablet", 400),
    ("Omeprazole 20mg", "Antacid", 30.00, "Omeprazole 20mg", "Human", "Capsule", 350),
    ("Ranitidine 150mg", "Antacid", 25.00, "Ranitidine 150mg", "Human", "Tablet", 200),
    ("Domperidone 10mg", "Antiemetic", 35.00, "Domperidone 10mg", "Human", "Tablet", 300),
    ("Ondansetron 4mg", "Antiemetic", 40.00, "Ondansetron 4mg", "Human", "Tablet", 250),
    # Antihistamines / Cold
    ("Cetirizine 10mg", "Antihistamine", 20.00, "Cetirizine 10mg", "Human", "Tablet", 500),
    ("Levocetirizine 5mg", "Antihistamine", 30.00, "Levocetirizine 5mg", "Human", "Tablet", 400),
    ("Fexofenadine 120mg", "Antihistamine", 60.00, "Fexofenadine 120mg", "Human", "Tablet", 200),
    ("Chlorpheniramine 4mg", "Antihistamine", 15.00, "Chlorpheniramine 4mg", "Human", "Tablet", 150),
    # Cardiovascular
    ("Amlodipine 5mg", "Cardiovascular", 40.00, "Amlodipine 5mg", "Human", "Tablet", 300),
    ("Amlodipine 10mg", "Cardiovascular", 60.00, "Amlodipine 10mg", "Human", "Tablet", 150),
    ("Losartan 50mg", "Cardiovascular", 50.00, "Losartan 50mg", "Human", "Tablet", 250),
    ("Telmisartan 40mg", "Cardiovascular", 65.00, "Telmisartan 40mg", "Human", "Tablet", 200),
    ("Metoprolol 25mg", "Cardiovascular", 45.00, "Metoprolol 25mg", "Human", "Tablet", 100),
    ("Metoprolol 50mg", "Cardiovascular", 70.00, "Metoprolol 50mg", "Human", "Tablet", 150),
    ("Atorvastatin 10mg", "Cardiovascular", 80.00, "Atorvastatin 10mg", "Human", "Tablet", 300),
    ("Atorvastatin 20mg", "Cardiovascular", 120.00, "Atorvastatin 20mg", "Human", "Tablet", 200),
    ("Rosuvastatin 10mg", "Cardiovascular", 90.00, "Rosuvastatin 10mg", "Human", "Tablet", 150),
    # Antidiabetic
    ("Metformin 500mg", "Antidiabetic", 30.00, "Metformin 500mg", "Human", "Tablet", 400),
    ("Metformin 1000mg", "Antidiabetic", 50.00, "Metformin 1000mg", "Human", "Tablet", 200),
    ("Glimepiride 1mg", "Antidiabetic", 40.00, "Glimepiride 1mg", "Human", "Tablet", 300),
    ("Glimepiride 2mg", "Antidiabetic", 60.00, "Glimepiride 2mg", "Human", "Tablet", 150),
    # Combinations (Partial Match Demos)
    ("Combiflam", "Analgesic", 40.00, "Ibuprofen 400mg + Paracetamol 325mg", "Human", "Tablet", 350),
    ("Flexon", "Analgesic", 35.00, "Ibuprofen 400mg + Paracetamol 325mg", "Human", "Tablet", 200),
    ("Cheston Cold", "Cold", 45.00, "Cetirizine 5mg + Paracetamol 325mg + Phenylephrine 10mg", "Human", "Tablet", 250),
    ("Ascoril LS", "Syrup", 90.00, "Levosalbutamol 1mg + Ambroxol 30mg + Guaiphenesin 50mg", "Human", "Syrup", 100),
    ("Augmentin 625 Duo", "Antibiotic", 180.00, "Amoxicillin 500mg + Clavulanic Acid 125mg", "Human", "Tablet", 150),
    # Vitamins / Supplements
    ("Vitamin C 500mg", "Supplement", 20.00, "Vitamin C 500mg", "Human", "Tablet", 500),
    ("Zincovit", "Supplement", 100.00, "Multivitamin + Multimineral", "Human", "Tablet", 400),
    ("Shelcal 500", "Supplement", 80.00, "Calcium 500mg + Vitamin D3 250 IU", "Human", "Tablet", 300),
    ("Neurobion Forte", "Supplement", 30.00, "Vitamin B Complex", "Human", "Tablet", 450),
    # Out of Stock / Low Stock Demo
    ("Dolo 650", "Analgesic", 30.00, "Paracetamol 650mg", "Human", "Tablet", 0), # Out of stock
    ("Crocine Advance", "Analgesic", 25.00, "Paracetamol 500mg", "Human", "Tablet", 5), # Low stock
    ("Sumo", "Analgesic", 50.00, "Nimesulide 100mg + Paracetamol 325mg", "Human", "Tablet", 0), # Out of stock
]

ANIMAL_MEDS = [
    ("Meloxicam 5mg", "Analgesic", 60.00, "Meloxicam 5mg", "Animal", "Tablet", 100),
    ("Meloxicam 1.5mg", "Analgesic", 40.00, "Meloxicam 1.5mg", "Animal", "Tablet", 150),
    ("Carprofen 25mg", "Analgesic", 120.00, "Carprofen 25mg", "Animal", "Tablet", 80),
    ("Carprofen 75mg", "Analgesic", 200.00, "Carprofen 75mg", "Animal", "Tablet", 50),
    ("Amoxicillin 250mg (Vet)", "Antibiotic", 50.00, "Amoxicillin 250mg", "Animal", "Capsule", 150),
    ("Amoxicillin 500mg (Vet)", "Antibiotic", 80.00, "Amoxicillin 500mg", "Animal", "Capsule", 100),
    ("Clavamox 62.5mg", "Antibiotic", 150.00, "Amoxicillin 50mg + Clavulanic Acid 12.5mg", "Animal", "Tablet", 120),
    ("Clavamox 125mg", "Antibiotic", 220.00, "Amoxicillin 100mg + Clavulanic Acid 25mg", "Animal", "Tablet", 90),
    ("Fipronil Spot-On", "Anti-parasitic", 350.00, "Fipronil 9.8%", "Animal", "Drops", 60),
    ("Ivermectin 10mg", "Anti-parasitic", 100.00, "Ivermectin 10mg", "Animal", "Tablet", 200),
    ("Ivermectin 1% Injection", "Anti-parasitic", 250.00, "Ivermectin 10mg/ml", "Animal", "Injection", 40),
    ("Bravecto 112.5mg", "Anti-parasitic", 1500.00, "Fluralaner 112.5mg", "Animal", "Tablet", 20),
    ("Pyrantel Pamoate", "De-wormer", 80.00, "Pyrantel Pamoate 50mg", "Animal", "Tablet", 150),
    ("Praziquantel 50mg", "De-wormer", 120.00, "Praziquantel 50mg", "Animal", "Tablet", 100),
    ("Metronidazole 250mg (Vet)", "Antibiotic", 45.00, "Metronidazole 250mg", "Animal", "Tablet", 150),
    ("Apoquel 3.6mg", "Anti-allergic", 1200.00, "Oclacitinib 3.6mg", "Animal", "Tablet", 30),
    ("Apoquel 5.4mg", "Anti-allergic", 1400.00, "Oclacitinib 5.4mg", "Animal", "Tablet", 25),
    ("Apoquel 16mg", "Anti-allergic", 1800.00, "Oclacitinib 16mg", "Animal", "Tablet", 20),
    ("Prednisolone 5mg (Vet)", "Steroid", 30.00, "Prednisolone 5mg", "Animal", "Tablet", 200),
    ("Vetprofen 100mg", "Analgesic", 250.00, "Carprofen 100mg", "Animal", "Tablet", 0), # Out of stock
]

def generate_medicines():
    db = get_db()
    db.medicines.delete_many({})
    
    meds_to_insert = []
    
    # Generate human meds
    for name, cat, price, comp, target, desc, stock in HUMAN_MEDS:
        meds_to_insert.append({
            "name": name,
            "category": cat,
            "price": price,
            "composition": comp,
            "targetSpecies": target,
            "description": desc,
            "stock": stock,
            "shelfNo": f"H-{random.randint(1, 20)}",
            "boxNo": str(random.randint(1, 10)),
            "createdAt": datetime.utcnow().isoformat()
        })
        
    # Generate animal meds
    for name, cat, price, comp, target, desc, stock in ANIMAL_MEDS:
        meds_to_insert.append({
            "name": name,
            "category": cat,
            "price": price,
            "composition": comp,
            "targetSpecies": target,
            "description": desc,
            "stock": stock,
            "shelfNo": f"V-{random.randint(1, 10)}",
            "boxNo": str(random.randint(1, 5)),
            "createdAt": datetime.utcnow().isoformat()
        })
        
    result = db.medicines.insert_many(meds_to_insert)
    print(f"Inserted {len(result.inserted_ids)} medicines.")

    # Create matching stock logs
    logs_to_insert = []
    today = datetime.now()
    for med in meds_to_insert:
        if med["stock"] > 0:
            # Simulate they arrived slightly before today
            receival_date = today - timedelta(days=random.randint(5, 60))
            expiry_date = receival_date + timedelta(days=random.randint(365, 730))
            logs_to_insert.append({
                "medicineId": str(med.get("_id", "")), # _id might not be in dict before insert_many, wait...
                "medicineName": med["name"],
                "quantityAdded": med["stock"],
                "receivalDate": receival_date.isoformat(),
                "expiryDate": expiry_date.isoformat(),
                "timestamp": receival_date.isoformat()
            })
            
    if logs_to_insert:
        db.stock_logs.delete_many({})
        db.stock_logs.insert_many(logs_to_insert)
        print(f"Inserted {len(logs_to_insert)} stock logs.")

    return list(db.medicines.find())

def generate_transactions(medicines):
    db = get_db()
    db.transactions.delete_many({})
    
    today = datetime.now()
    start_date = today - relativedelta(months=6) # 6 months of data
    
    transactions = []
    
    # Demand profiles
    high_demand_ids = [m['_id'] for m in medicines if m['name'] in ["Paracetamol 500mg", "Vitamin C 500mg", "Cetirizine 10mg"]]
    trending_up_ids = [m['_id'] for m in medicines if m['name'] in ["Azithromycin 500mg", "Pantoprazole 40mg"]]
    trending_down_ids = [m['_id'] for m in medicines if m['name'] in ["Aspirin 150mg", "Glimepiride 2mg"]]
    low_demand_ids = [m['_id'] for m in medicines if m['name'] in ["Bravecto 112.5mg", "Apoquel 16mg"]]
    
    current_date = start_date
    while current_date <= today:
        # Number of transactions per day
        num_tx = random.randint(5, 15)
        
        for _ in range(num_tx):
            items = []
            num_items = random.randint(1, 4)
            total_amount = 0
            
            for _ in range(num_items):
                # Pick a medicine based on demand profile
                rand_val = random.random()
                
                # Check for trending up (more likely in recent months)
                months_passed = (current_date.year - start_date.year) * 12 + current_date.month - start_date.month
                up_prob = 0.05 + (months_passed * 0.05)
                down_prob = 0.20 - (months_passed * 0.03)
                
                if rand_val < 0.4:
                    med_id = random.choice(high_demand_ids)
                elif rand_val < 0.4 + up_prob:
                    med_id = random.choice(trending_up_ids)
                elif rand_val < 0.4 + up_prob + down_prob:
                    med_id = random.choice(trending_down_ids)
                elif rand_val < 0.95:
                    # Regular demand
                    med_id = random.choice([m['_id'] for m in medicines if m['_id'] not in high_demand_ids + trending_up_ids + trending_down_ids + low_demand_ids])
                else:
                    med_id = random.choice(low_demand_ids)
                    
                med = next(m for m in medicines if m['_id'] == med_id)
                quantity = random.randint(1, 5) if med_id in high_demand_ids else random.randint(1, 2)
                
                items.append({
                    "medicineId": str(med_id),
                    "name": med['name'],
                    "quantity": quantity,
                    "price": med['price']
                })
                total_amount += quantity * med['price']
                
            transactions.append({
                "customerName": f"Customer {random.randint(100, 999)}",
                "zipCode": random.choice(["462001", "462002", "462003", "462010", "462023"]),
                "items": items,
                "totalAmount": total_amount,
                "createdAt": current_date.isoformat()
            })
            
        current_date += timedelta(days=1)
        
    db.transactions.insert_many(transactions)
    print(f"Inserted {len(transactions)} transactions spanning 6 months.")

def run_seed():
    print("Starting database seed...")
    medicines = generate_medicines()
    generate_transactions(medicines)
    print("Seed complete!")

if __name__ == "__main__":
    run_seed()
