import requests
from pymongo import MongoClient

MONGO_URI = "mongodb://khareb1981_db_user:4PoB07Lwo3z8aLuv@ac-hie9gxs-shard-00-00.ichjljf.mongodb.net:27017,ac-hie9gxs-shard-00-01.ichjljf.mongodb.net:27017,ac-hie9gxs-shard-00-02.ichjljf.mongodb.net:27017/pharmacy_v2?ssl=true&authSource=admin&retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client['pharmacy_v2']
transactions_col = db['transactions']

# Delete all the seeded dummy data
result = transactions_col.delete_many({"customerName": "Demo Patient"})
print(f"Deleted {result.deleted_count} dummy transactions. Slate is clean for live demo!")
