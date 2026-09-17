import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "pharmacy_v2")

client = None
db = None

def get_db():
    global client, db
    if client is None:
        try:
            client = MongoClient(MONGODB_URI)
            db = client[MONGODB_DATABASE]
            logging.info(f"Connected to MongoDB database: {MONGODB_DATABASE}")
        except Exception as e:
            logging.error(f"MongoDB connection failed: {e}")
            raise e
    return db

def close_db():
    global client
    if client:
        client.close()
        client = None
        logging.info("MongoDB connection closed.")
