from pymongo import MongoClient

client = MongoClient('mongodb://khareb1981_db_user:4PoB07Lwo3z8aLuv@ac-hie9gxs-shard-00-00.ichjljf.mongodb.net:27017,ac-hie9gxs-shard-00-01.ichjljf.mongodb.net:27017,ac-hie9gxs-shard-00-02.ichjljf.mongodb.net:27017/pharmacy_v2?ssl=true&authSource=admin&retryWrites=true&w=majority')
db = client.pharmacy_v2
res = db.transactions.update_many({'condition': {'$exists': False}}, {'$set': {'condition': 'Malaria'}})
print(f'Fixed {res.modified_count} transactions to include condition')
