from utils.date_utils import get_last_month_range, get_last_quarter_range
import pandas as pd
import math

def calculate_sales_analytics(medicines, transactions):
    """
    Calculate sales analytics for each medicine based on transactions.
    """
    df_tx = pd.DataFrame(transactions)
    
    # Ensure datetime
    if not df_tx.empty and 'createdAt' in df_tx.columns:
        df_tx['createdAt'] = pd.to_datetime(df_tx['createdAt'])
    else:
        # Create empty dataframe with correct columns if no transactions
        df_tx = pd.DataFrame(columns=['createdAt', 'items'])
        
    last_month_start, last_month_end = get_last_month_range()
    quarter_start, quarter_end = get_last_quarter_range()
    
    # Flatten items to a simpler structure
    flattened_items = []
    for _, row in df_tx.iterrows():
        created_at = row['createdAt']
        items = row.get('items', [])
        for item in items:
            flattened_items.append({
                'medicineId': str(item.get('medicineId')),
                'quantity': item.get('quantity', 0),
                'createdAt': created_at
            })
            
    df_items = pd.DataFrame(flattened_items)
    if not df_items.empty:
        df_items['createdAt'] = pd.to_datetime(df_items['createdAt'])
    
    analytics = []
    
    for med in medicines:
        med_id = str(med['_id'])
        current_stock = med.get('stock', 0)
        
        last_month_sales = 0
        quarter_sales = 0
        
        if not df_items.empty:
            med_tx = df_items[df_items['medicineId'] == med_id]
            
            # Filter for last month
            lm_tx = med_tx[(med_tx['createdAt'] >= last_month_start) & (med_tx['createdAt'] <= last_month_end)]
            last_month_sales = int(lm_tx['quantity'].sum())
            
            # Filter for last quarter
            q_tx = med_tx[(med_tx['createdAt'] >= quarter_start) & (med_tx['createdAt'] <= quarter_end)]
            quarter_sales = int(q_tx['quantity'].sum())
            
        monthly_avg = quarter_sales / 3.0 if quarter_sales > 0 else 0
        
        # Calculate trend
        if monthly_avg > 0:
            trend_ratio = last_month_sales / monthly_avg
            trend_percentage = (trend_ratio - 1) * 100
        else:
            trend_percentage = 0.0 if last_month_sales == 0 else 100.0
            
        # Recommendation Score
        # Simple normalization: cap sales at some reasonable max, e.g. 500 for demo
        max_sales_cap = 500
        norm_monthly = min(last_month_sales / max_sales_cap, 1.0) * 100
        norm_quarter = min(quarter_sales / (max_sales_cap * 3), 1.0) * 100
        norm_trend = max(min(trend_percentage / 100.0, 1.0), -1.0) * 100  # Cap between -100 and +100
        # Stock score: lower stock = higher score for restock
        norm_stock = max(0, 100 - (current_stock / (max_sales_cap * 1.5)) * 100) if current_stock > 0 else 100

        recommendation_score = (
            0.40 * norm_monthly +
            0.30 * norm_quarter +
            0.20 * max(0, norm_trend) + # Only positive trend adds to score
            0.10 * norm_stock
        )
        recommendation_score = min(max(recommendation_score, 0), 100)
        
        # Demand Classification
        if monthly_avg >= 100:
            demand_level = "Very High"
        elif monthly_avg >= 50:
            demand_level = "High"
        elif monthly_avg >= 20:
            demand_level = "Moderate"
        else:
            demand_level = "Low"
            
        # Restock logic
        target_stock = math.ceil(monthly_avg * 1.5)
        suggested_restock = max(0, target_stock - current_stock)
        
        # Override to 0 if demand is so low that we don't care
        if demand_level == "Low" and current_stock > 5:
            suggested_restock = 0
            
        # Restock Classification
        if current_stock == 0 and demand_level in ["Very High", "High", "Moderate"]:
            restock_status = "RESTOCK URGENT"
            restock_recommended = True
        elif suggested_restock > 0:
            restock_status = "RESTOCK SOON"
            restock_recommended = True
        elif demand_level == "Low":
            restock_status = "LOW DEMAND"
            restock_recommended = False
        else:
            restock_status = "SUFFICIENT STOCK"
            restock_recommended = False
            
        # Explanations
        if restock_recommended:
            reason = f"Current stock ({current_stock}) is below the target ({target_stock}) for {demand_level.lower()} demand."
        else:
            reason = f"Current stock ({current_stock}) is sufficient for {demand_level.lower()} demand."

        analytics.append({
            "medicine": med.get("name"),
            "medicineId": med_id,
            "lastMonthSales": last_month_sales,
            "lastQuarterSales": quarter_sales,
            "monthlyAverage": round(monthly_avg, 1),
            "currentStock": current_stock,
            "trendPercentage": round(trend_percentage, 2),
            "recommendationScore": round(recommendation_score, 1),
            "demandLevel": demand_level,
            "restockStatus": restock_status,
            "restockRecommended": restock_recommended,
            "suggestedRestock": suggested_restock,
            "reason": reason
        })
        
    # Sort by score descending
    analytics.sort(key=lambda x: x['recommendationScore'], reverse=True)
    return analytics
