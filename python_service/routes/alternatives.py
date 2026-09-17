from fastapi import APIRouter, HTTPException
from database.mongodb import get_db
from services.alternative_matcher import match_alternatives
from bson import ObjectId

router = APIRouter()

@router.get("/{medicine_id}")
def get_alternatives(medicine_id: str):
    db = get_db()
    try:
        source_medicine = db.medicines.find_one({"_id": ObjectId(medicine_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid medicine ID format")
        
    if not source_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
        
    all_medicines = list(db.medicines.find())
    alternatives = match_alternatives(source_medicine, all_medicines)
    
    return {
        "sourceMedicine": {
            "id": str(source_medicine["_id"]),
            "name": source_medicine.get("name"),
            "composition": source_medicine.get("composition"),
            "targetSpecies": source_medicine.get("targetSpecies")
        },
        "alternatives": alternatives
    }
