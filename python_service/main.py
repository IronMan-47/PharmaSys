import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.mongodb import get_db, close_db
from routes.analytics import router as analytics_router
from routes.alternatives import router as alternatives_router

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

app = FastAPI(title="PharmaSys Intelligence Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    get_db()
    logging.info("Python Intelligence Service started.")

@app.on_event("shutdown")
def shutdown_event():
    close_db()

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(alternatives_router, prefix="/api/alternatives", tags=["Alternatives"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
