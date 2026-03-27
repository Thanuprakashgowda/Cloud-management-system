# ☁ Cloud SMS — AI-Powered School Management System

<div align="center">

![Cloud SMS Banner](https://img.shields.io/badge/Cloud%20SMS-Enterprise%20Edition-6366f1?style=for-the-badge&logo=cloud&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-TiDB%20Cloud-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5-8B5CF6?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A premium, enterprise-grade school management platform powered by Google Gemini AI.**  
Manage students, courses, departments, and academic results — all from a stunning glassmorphism dashboard.

[🚀 Live Demo](https://cloud-management-system-hazel.vercel.app) • [📂 GitHub Repo](https://github.com/Thanuprakashgowda/Cloud-management-system)

</div>

---

## ✨ Features

### 🤖 AI-Powered Intelligence
| Feature | Description |
|---|---|
| **CloudBot Chatbot** | Floating AI assistant that answers natural language questions about live school data (e.g. *"How many students do we have?"*) |
| **Executive Dashboard Report** | One-click AI-generated operational summary of the school's performance metrics |
| **Student Action Planner** | Per-student AI strategy generator — click "Ask AI" on any result row to get a 3-point personalized academic improvement plan |

### 📊 Dashboard & Analytics
- **Live stat cards** for Total Students, Active Courses, and Departments — clickable to navigate to the relevant section
- **Enrollment Distribution Doughnut Chart** — color-coded by department with animated center label showing total students, percentage tooltips
- **Course Performance Bar Chart** — score-based color coding (🟢 Excellent ≥75, 🟡 Average 50-74, 🔴 Needs Improvement <50), staggered animation, dual-layer glow bars
- **Dark / Light Mode** with smooth transitions and deep space aurora gradient backgrounds

### 🎓 Student Management
- Add, view, and delete student records
- Fields: Name, Email, Date of Birth, Department assignment
- Export to **branded PDF** (landscape, school header, summary row, striped rows, page footer) or **Excel (.xlsx)**

### 📚 Course Management
- Add and delete courses with credit hours and department linkage
- Export to PDF / Excel

### 🏫 Department Management
- Add and delete departments with Head of Department
- Automatically populates student and course dropdowns on change

### 📝 Academic Results
- **Add Result** — Select student + course from live dropdowns, choose grade (A+ → F), enter marks (0-100)
- View all results with AI Insight buttons per row
- Delete results (auto-removes linked enrollment records)
- Export to PDF / Excel with AI insight column included

### 👤 Admin Profile System
- Clickable admin panel in sidebar showing:
  - School name & avatar with institution initials
  - Registered email and account creation date (fetched from DB)
  - Live counts: total students, courses, departments
  - Sign out button

### 📄 PDF Export (Enterprise Quality)
- A4 Landscape orientation
- Deep purple branded header with school name and export timestamp
- Summary statistics row (students / courses / departments)
- Alternating row shading, Inter font, rounded styles
- Page number footer on every page
- AI Insight column cleanly rendered as text (no HTML artifacts)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES2022+) |
| **Design** | Custom CSS Design System — Deep Space Dark + Aurora Accents |
| **Charts** | Chart.js 4 |
| **AI** | Google Gemini 1.5 Flash (`@google/genai`) |
| **Backend** | Node.js + Express.js |
| **Database** | MySQL (TiDB Cloud Serverless) |
| **Auth** | JWT (`jsonwebtoken`) + bcrypt password hashing |
| **PDF Export** | jsPDF + jsPDF-AutoTable |
| **Excel Export** | SheetJS (XLSX) |
| **Deployment** | Vercel (Serverless Functions) |

---

## 🚀 Live Deployment

| Environment | URL |
|---|---|
| **Production** | [https://cloud-management-system-hazel.vercel.app](https://cloud-management-system-hazel.vercel.app) |
| **Repository** | [https://github.com/Thanuprakashgowda/Cloud-management-system](https://github.com/Thanuprakashgowda/Cloud-management-system) |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MySQL database (local or [TiDB Cloud](https://tidbcloud.com) Serverless)
- Google Gemini API Key → [Get one here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Thanuprakashgowda/Cloud-management-system.git
cd Cloud-management-system

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see below)

# 4. Set up the database
# Run database/schema.sql on your MySQL server

# 5. Start the server
node server.js
# → Open http://localhost:3000
```

### Environment Variables (`.env`)

```env
DB_HOST=your-tidb-or-mysql-host
DB_PORT=4000
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=cloud_sms

JWT_SECRET=your-super-secret-jwt-key-min-32-chars

GEMINI_API_KEY=your-google-gemini-api-key
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard:
# → Settings → Environment Variables
# Add all keys from .env above
```

---

## 🗄 Database Schema

```sql
administrators  -- Multi-school auth (email, password_hash, school_name)
students        -- Student records (name, email, dob, department_id)
departments     -- Department catalogue (name, head_of_dept)
courses         -- Course catalogue (name, credits, department_id)
enrollments     -- Student ↔ Course link (student_id, course_id, grade)
marks           -- Marks per enrollment (enrollment_id, marks)
```

Import the full schema:
```bash
mysql -u root -p cloud_sms < database/schema.sql
```

---

## 📁 Project Structure

```
Cloud-management-system/
├── public/
│   ├── index.html          # SPA frontend
│   ├── style.css           # Full design system (Deep Space theme)
│   └── script.js           # All frontend logic + API calls
├── controllers/
│   ├── auth.controller.js  # Register / Login / Profile
│   ├── student.controller.js
│   ├── course.controller.js
│   ├── department.controller.js
│   ├── mark.controller.js  # Results CRUD
│   ├── stats.controller.js # Dashboard analytics queries
│   └── ai.controller.js    # Gemini AI endpoints
├── routes/                 # Express route definitions
├── middleware/
│   └── verifyToken.js      # JWT auth middleware
├── database/
│   ├── db.js               # MySQL connection pool + SSL
│   └── schema.sql          # Full DB schema
├── config/
│   └── db.config.js        # DB configuration
├── server.js               # Express app entry point
└── vercel.json             # Vercel serverless config
```

---

## 🔐 Security

- All API routes (except `/api/auth/login` and `/api/auth/register`) are protected by **JWT Bearer Token** middleware
- Passwords are hashed with **bcrypt** (10 salt rounds)
- SSL encryption is **automatically enabled** for cloud database connections (TiDB)
- Connection **pooling** prevents serverless timeout issues on Vercel

---

## 🌟 Screenshots

> **Dashboard** — Live stats, AI Executive Report, Enrollment Doughnut, Course Performance Bar Chart  
> **Students** — Full CRUD table with PDF/Excel export  
> **Results** — Add results with grade + marks, AI "Ask AI" per student  
> **CloudBot** — Floating AI chatbot in bottom-right corner  
> **Admin Profile** — Click the sidebar user panel for school details  

---

## 📜 License

MIT License © 2026 [Thanuprakash Gowda](https://github.com/Thanuprakashgowda)

---

<div align="center">
Built with ❤️ using Node.js, Gemini AI, and TiDB Cloud
</div>
