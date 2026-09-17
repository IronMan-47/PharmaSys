# PharmaSys Python Intelligence Service

## 1. What the service does
This service provides advanced intelligence features for the PharmaSys pharmacy management system. It introduces two primary capabilities:
- **Sales-based Medicine Recommendation & Restock Intelligence:** Analyzes historical POS transaction data to suggest optimal restocking, calculate demand trends, and rank medicines by popularity.
- **Composition-based Alternative Medicine Suggester:** Provides intelligent, stock-aware alternative medicines when a requested drug is out of stock by matching active ingredients, strength, and target species.

## 2. Why Python is used
Python was selected as a separate microservice layer because:
- It serves as a strong foundation for future Machine Learning (PharmAI) integrations.
- Libraries like `pandas` and `numpy` make data processing, time-series analysis, and trend calculations significantly easier and cleaner compared to Node.js.
- It decouples data analytics from the high-throughput transactional Node.js POS backend, preventing intensive analytical queries from blocking the main event loop during checkouts.

## 3. Architecture
The system operates in a microservices-style architecture:
- **React Frontend**: Main user interface.
- **Node.js/Express Backend**: Handles transactional operations (POS checkouts, CRUD, Auth).
- **Python Intelligence Service (FastAPI)**: Handles heavy read operations, data aggregations, and rule-based inference for recommendations and alternatives.
- **MongoDB**: The shared data layer used by both Node.js and Python.

## 4. Installation
```bash
cd python_service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

## 5. Environment variables
Create a `.env` file in the `python_service` directory:
```env
MONGODB_URI=mongodb://<your-db-credentials>
MONGODB_DATABASE=pharmacy_v2
PORT=8000
```

## 6. How to start the service
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 7. API Endpoints
- `GET /health` : Health check.
- `GET /api/analytics/sales` : Returns all sales analytics, trends, and restock recommendations.
- `GET /api/analytics/recommendations?period=month` : Returns filtered restock recommendations.
- `GET /api/analytics/medicine/{medicine_id}` : Returns specific analytics for a single medicine.
- `GET /api/alternatives/{medicine_id}` : Returns potential composition-based alternatives for a medicine.

## 8. Recommendation Algorithm
The recommendation engine uses a rule-based formula for explainability. It calculates:
- Last month sales
- Last quarter (3 months) sales
- Trend percentage (comparing last month to the 3-month average)
- Current stock levels

It computes a normalized score:
`Score = (0.40 * Monthly) + (0.30 * Quarter) + (0.20 * Trend) + (0.10 * Stock urgency)`
It also calculates a suggested restock quantity `(1.5 * Monthly Average) - Current Stock` and classifies demand (Low, Moderate, High, Very High).

## 9. Composition Matching Algorithm
The alternative matching engine:
1. First strictly filters by `targetSpecies` (Human vs. Animal) to prevent fatal dispensing errors.
2. Normalizes the `composition` string (lowercasing, standardizing whitespace, stripping punctuation).
3. Evaluates similarity:
   - **Exact Match (Score 100)**: Identical composition and strength.
   - **Different Strength (Score 80)**: Shares active ingredients but potentially different dosages. Requires pharmacist verification.
   - **Partial Match (Score 50)**: Shares some, but not all, active ingredients.
4. Sorts the results by Match Score (descending) and then by Current Stock (descending) to prioritize available inventory.

## 10. Database Structure
The service connects to the existing MongoDB and utilizes:
- `medicines` collection: Contains name, composition, stock, price, targetSpecies.
- `transactions` collection: Contains checkout history with items, quantities, and dates.

## 11. Seed Command
To generate 70 realistic human/animal medicines and 6 months of demand-profiled transaction data:
```bash
python seed/seed_database.py
```

## 12. Testing
Run local tests or manually verify the FastAPI interactive docs at `http://localhost:8000/docs`.

## 13. Future ML Extension
The current analytical services (`services/sales_analyzer.py` and `services/alternative_matcher.py`) are strictly rule-based for immediate explainability. The architecture is designed so that these modules can be swapped with ML models (e.g., using `scikit-learn` or PyTorch) for time-series demand forecasting and NLP-based ingredient analysis in Phase II (PharmAI).
