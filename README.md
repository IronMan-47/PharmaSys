# 💊 PharmaSys

> A modern, localized pharmacy management and point-of-sale (POS) system engineered for independent businesses and rural health centers.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📖 Overview
The retail pharmaceutical sector forms the backbone of primary healthcare distribution. However, independent pharmacies operate on highly outdated digital infrastructure. **PharmaSys** introduces a modernized, "Local-First" pharmacy management ecosystem built on the MERN stack.

Designed to overcome the limitations of intermittent internet connectivity and clunky legacy ERPs (like Marg), PharmaSys provides an ultra-fast POS dashboard, zero-latency inventory filtering, physical warehouse mapping, and client-side PDF receipt generation.

Furthermore, it establishes a silent spatial data-collection pipeline by capturing patient zip codes during checkout—laying the groundwork for future predictive epidemiological heatmaps (Phase II).

## ✨ Key Features (Phase I)
*   🛒 **High-Speed POS & Dynamic Cart:** Fast billing with duplicate detection and real-time total calculation.
*   📦 **Real-Time Inventory Management:** Zero-latency client-side search filtering and physical warehouse mapping (Shelf/Box numbers).
*   🖨️ **Automated PDF Receipts:** Client-side generation using `jsPDF` for fast, reliable, and paperless billing without server load.
*   🔒 **Secure Authentication & Audit Logging:** JWT-based stateless login with a complete chronological transaction and stock audit trail.
*   📍 **ZIP-Code Based Data Collection:** Collects demographic ZIP codes at checkout to build the foundation for spatial health analytics.
*   📡 **Local-First Operation:** Architected to run flawlessly on a local network Intranet without requiring external internet access.

## 🛠️ Technology Stack
*   **Frontend:** React.js (v18), Vite, TailwindCSS, jsPDF
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Native Driver for maximum query throughput)
*   **Authentication:** JSON Web Tokens (JWT)

## 🚀 Running the Project Locally

### 1. Database Setup
Ensure you have MongoDB Community Server installed and running on default port `27017`.

### 2. Backend Initialization
```bash
cd backend
npm install
node seed.js # (Optional) Seed the database with sample medicines
npm start    # Starts the API server on port 5001
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev  # Starts the Vite development server
```

## 👥 Team Members
Developed as part of **Project Exhibition I** (B.Tech CSE-Core) at VIT Bhopal.
*   Anubhav Khare (25BCE10004)
*   Parth Chouhan (25BCE10106)
*   Adit Prasad (25BCE10115)
*   Sheershak Saha (25BCE10267)
*   Divyansh Verma (25BCE10338)

**Supervisor:** Dr. Daood Saleem
