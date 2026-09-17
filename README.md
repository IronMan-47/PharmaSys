# 💊 PharmaSys

> A modern, localized pharmacy management, point-of-sale (POS), and intelligence system engineered for independent businesses and rural health centers.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📖 Overview
The retail pharmaceutical sector forms the backbone of primary healthcare distribution. However, independent pharmacies operate on highly outdated digital infrastructure. **PharmaSys** introduces a modernized, "Local-First" pharmacy management ecosystem built on the MERN stack with a Python intelligence layer.

Designed to overcome the limitations of clunky legacy ERPs, PharmaSys provides an ultra-fast POS dashboard, zero-latency inventory filtering, physical warehouse mapping, and client-side PDF receipt generation.

## 🚀 Key Features
*   🛒 **High-Speed POS:** Fast billing with duplicate detection, positive-integer validation, and real-time total calculation.
*   📦 **Real-Time Inventory Management:** Zero-latency client-side search filtering and physical warehouse mapping (Shelf/Box numbers).
*   📄 **Automated PDF Receipts:** Client-side generation using `jsPDF` for fast, reliable billing without server load.
*   🔐 **Secure Authentication & Audit Logging:** JWT-based stateless login (server-side verified), input validation, and a chronological stock audit trail.
*   🧠 **PharmAI & Analytics (Phase II):** 
    * Python FastAPI microservice powering sales trends and demand classification.
    * Composition-based Alternative Medicine matching algorithm.
    * Assistive AI autofill for quick medicine entry (via Groq/Gemini).

## 🛠️ Technology Stack
*   **Frontend:** React.js, Vite, TailwindCSS, jsPDF
*   **Backend (Transactional):** Node.js, Express.js
*   **Backend (Analytical):** Python, FastAPI, Pandas
*   **Database:** MongoDB (Native Driver & PyMongo)

## 🏃 Running the Project Locally

### 1. Configuration
Create a `.env` file in `backend/`, `frontend/`, and `python_service/` using the respective `.env.example` templates.

### 2. Backend Initialization (Node.js)
```bash
cd backend
npm install
npm start    # Starts the API server on port 5001
```

### 3. Intelligence Service (FastAPI)
```bash
cd python_service
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python seed_database.py  # (Optional) Seed mock analytics data
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. Frontend Initialization
```bash
cd frontend
npm install
npm run dev  # Starts the Vite development server
```

## 👨‍💻 Team Members
Developed as part of **Project Exhibition I** (B.Tech CSE-Core) at VIT Bhopal.
*   Anubhav Khare (25BCE10004)
*   Parth Chouhan (25BCE10106)
*   Adit Prasad (25BCE10115)
*   Sheershak Saha (25BCE10267)
*   Divyansh Verma (25BCE10338)

**Supervisor:** Dr. Daood Saleem
