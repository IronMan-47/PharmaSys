from fastapi import APIRouter, HTTPException, Query
from database.mongodb import get_db
from services.sales_analyzer import calculate_sales_analytics
from utils.date_utils import get_last_month_range, get_last_quarter_range, format_date_range
from bson import ObjectId

router = APIRouter()

@router.get("/sales")
def get_sales_analytics():
    db = get_db()
    medicines = list(db.medicines.find())
    transactions = list(db.transactions.find())
    
    analytics = calculate_sales_analytics(medicines, transactions)
    
    # Calculate period strings for the UI
    lm_start, lm_end = get_last_month_range()
    q_start, q_end = get_last_quarter_range()
    
    return {
        "periods": {
            "lastMonth": format_date_range(lm_start, lm_end),
            "lastQuarter": format_date_range(q_start, q_end)
        },
        "analytics": analytics
    }

@router.get("/recommendations")
def get_recommendations(period: str = Query("month", description="month or quarter")):
    db = get_db()
    medicines = list(db.medicines.find())
    transactions = list(db.transactions.find())
    
    analytics = calculate_sales_analytics(medicines, transactions)
    
    # Filter for items that need restock
    recommendations = [a for a in analytics if a["restockRecommended"]]
    return recommendations

@router.get("/medicine/{medicine_id}")
def get_medicine_analytics(medicine_id: str):
    db = get_db()
    try:
        med = db.medicines.find_one({"_id": ObjectId(medicine_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid medicine ID")
        
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
        
    transactions = list(db.transactions.find())
    analytics = calculate_sales_analytics([med], transactions)
    if not analytics:
        raise HTTPException(status_code=404, detail="Analytics not found")
        
    return analytics[0]
