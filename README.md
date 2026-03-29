# Cloud SMS — AI-Powered School/College/University Management System

<div align="center">

![Cloud SMS Banner](https://img.shields.io/badge/Cloud%20SMS-Enterprise%20Edition-6366f1?style=for-the-badge&logo=cloud&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-TiDB%20Cloud-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5-8B5CF6?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A premium, enterprise-grade multi-tenant school management platform powered by Google Gemini AI.**  
Manage students, courses, departments, academic results, and attendance — all from a stunning glassmorphism dashboard.

[ Live Demo](https://cloud-management-system-black.vercel.app) • [ GitHub Repo](https://github.com/Thanuprakashgowda/Cloud-management-system)

</div>

---

##  Features

###  Enterprise Multi-Tenancy
- **Data Isolation**: Secure separation of data per administrative account. Each institution (School, College, etc.) only sees and manages their own students, courses, and results using `admin_id` scoped queries.
- **Premium Split-Screen Auth**: A modern, animated login/registration experience with branded feature highlights and animated background blobs.
- **Institution Branding**: Support for various institution types (School, College, University, Academy, Institute).

### AI-Powered Intelligence
| Feature | Description |
|---|---|
| **CloudBot Chatbot** | Floating AI assistant that answers natural language questions about live school data (e.g. *"How many students do we have?"*) |
| **Executive Dashboard Report** | One-click AI-generated operational summary of the school's performance metrics |
| **Student Action Planner** | Per-student AI strategy generator — click "Ask AI" on any result row to get a 3-point personalized academic improvement plan |

###  Dashboard & Analytics
- **Live stat cards** for Total Students, Active Courses, and Departments — clickable to navigate to the relevant section.
- **Enrollment Distribution Doughnut Chart** — color-coded by department with animated center label showing total students.
- **Course Performance Bar Chart** — score-based color coding (🟢 Excellent ≥75, 🟡 Average 50-74, 🔴 Needs Improvement <50), staggered animation.
- **Dark / Light Mode** with smooth transitions and deep space aurora gradient backgrounds.

### Student Management
- Full CRUD operations: Add, view, edit, and delete student records.
- Fields: Name, Email, Date of Birth, Department assignment.
- Export to **branded PDF** or **Excel (.xlsx)**.
- **Pagination** support for handling large student datasets.

###  Course Management
- Add and delete courses with credit hours and department linkage.
- Data isolated per institution.
- Export to PDF / Excel.

###  Department Management
- Add and delete departments with Head of Department tracking.
- Automatically populates student and course dropdowns dynamically.

###  Academic Results
- **Add & Edit Results** — Select student + course from live dropdowns, set grade and marks.
- **Inline Editing**: Ability to update existing grades and marks for any record.
- View all results with **AI Insight** buttons per row.
- Delete results (auto-removes linked enrollment records via cascade).
- Export to PDF / Excel with AI insights included.

### Attendance Tracking System (NEW)
- **Daily Entry**: Toggle Present, Absent, or Late status for all students on any date.
- **Summary Analytics**: Real-time display of Present/Absent counts and Attendance Rate %.
- **30-Day History**: Detailed history log with paginated records for historical tracking.
- **Excel Export**: Export attendance sheets for any date to `.xlsx`.

### Admin Profile System
- Clickable admin panel in sidebar showing:
  - Institution name & avatar with initials.
  - Registered email and account creation date.
  - Live counts: total students, courses, departments.
  - Quick Sign-out.

###  PDF & Excel Export (Enterprise Quality)
- **Branded PDF**: A4 Landscape, school header, summary statistics, page numbers, and clean data rendering.
- **Smart Excel**: Professional cell widths and formatted headers for all modules.

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES2022+) |
| **Design** | Custom CSS Design System — Deep Space Dark + Aurora Accents |
| **Charts** | Chart.js 4 |
| **AI** | Google Gemini 1.5 Flash (`@google/genai`) |
| **Backend** | Node.js + Express.js |
| **Database** | MySQL (TiDB Cloud Serverless Distributed SQL) |
| **Auth** | JWT (`jsonwebtoken`) + bcrypt password hashing |
| **PDF Export** | jsPDF + jsPDF-AutoTable |
| **Excel Export** | SheetJS (XLSX) |
| **Deployment** | Vercel (Frontend & Serverless Functions) |

---

##  Live Deployment

| Environment | URL |
|---|---|
| **Production** | [https://cloud-management-system-black.vercel.app](https://cloud-management-system-black.vercel.app) |
| **Repository** | [https://github.com/Thanuprakashgowda/Cloud-management-system](https://github.com/Thanuprakashgowda/Cloud-management-system) |

---

##  Local Setup

### Prerequisites
- Node.js 18+
- MySQL database (local or [TiDB Cloud](https://tidbcloud.com))
- Google Gemini API Key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Thanuprakashgowda/Cloud-management-system.git
cd Cloud-management-system

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env file based on the keys below

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
DB_NAME=student_management_system

JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-google-gemini-api-key
```

---

##  Project Structure

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
│   ├── mark.controller.js  # Results CRUD & Edits
│   ├── stats.controller.js # Dashboard analytics queries
│   ├── attendance.controller.js # NEW: Attendance Logic
│   └── ai.controller.js    # Gemini AI endpoints
├── routes/                 # Express route definitions
├── middleware/
│   └── verifyToken.js      # JWT auth middleware
├── database/
│   ├── db.js               # MySQL connection pool + SSL
│   └── schema.sql          # Full DB schema (Updated)
├── server.js               # Express app entry point
└── vercel.json             # Vercel serverless config
```

---

##  License

MIT License © 2026 [Thanuprakash Gowda](https://github.com/Thanuprakashgowda)

---

<div align="center">

Built  by **[Thanuprakash Gowda](https://www.linkedin.com/in/thanuprakash-gowda)**  
[GitHub](https://github.com/Thanuprakashgowda) · [LinkedIn](https://www.linkedin.com/in/thanuprakash-gowda)

![LinkedIn](https://img.shields.io/badge/LinkedIn-Thanuprakash%20Gowda-0A66C2?style=flat-square&logo=linkedin&logoColor=white)

</div>
