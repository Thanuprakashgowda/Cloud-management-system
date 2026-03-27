# 🌐 Cloud Management System (CloudSMS)

### 🚀 Smart, Automated & Scalable Institution Management
Cloud Management System (CloudSMS) is a premium, enterprise-grade platform designed for schools, colleges, and universities to manage their academic data with ease. Built with a modern tech stack (Node.js, TiDB Cloud, and Google Gemini AI), it offers a stunning UI and powerful automation tools.

**Live Demo:** [https://cloud-management-system-black.vercel.app/](https://cloud-management-system-black.vercel.app/)

---

## ✨ Key Features

### 🏢 Core Management
- **Student Management:** Full CRUD operations for student profiles, department assignments, and biodata.
- **Course Management:** Manage academic courses, credit hours, and department links.
- **Department Management:** Track various departments and their heads of department (HOD).
- **Academic Results:** Manage student enrollments, assign grades, and record marks. Features **live result editing** for corrections.

### 📅 Advanced Attendance System
- **Daily Entry:** Simple interface for marking students as *Present*, *Absent*, or *Late*.
- **Summary Dashboard:** Real-time calculation of Present/Absent counts and Attendance Rate %.
- **30-Day History:** Visual history log with paginated records for historical tracking.
- **Excel Export:** Export daily attendance sheets to `.xlsx` for offline reporting.

### 🤖 AI-Powered Intelligence
- **AI Action Plans:** One-click personalized academic strategies for students based on their grades and marks, powered by **Google Gemini AI**.
- **CloudBot Assistant:** A smart, context-aware chatbot that understands the database schema. Ask questions like *"Who is the top performing student?"* or *"How many students are in the CS department?"* to get instant answers.

### 🔒 Enterprise Security & Isolation
- **Multi-tenant Architecture:** Secure login and registration. Each administrator manages their own data; students, courses, and results are isolated per account using `admin_id` filtering.
- **Institution Branding:** Support for multiple institution types (Schools, Colleges, Universities, Academies).

### 🖥️ Premium User Experience
- **Aurora UI Design:** A stunning "Deep Space" theme featuring Glassmorphism, smooth animations, and a sleek split-screen login.
- **Dark Mode Support:** Toggle between professional light and premium dark themes with persistent storage.
- **Pagination:** Efficient data handling with reusable pagination for large datasets.
- **Export Tools:** Save any table as a professional PDF report or Excel spreadsheet.

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3 (Vanilla + Glassmorphism), JavaScript (ES6+)
- **Backend:** Node.js, Express.js (RESTful API)
- **Database:** [TiDB Cloud](https://pingcap.com/tidb-cloud) (Serverless Distributed SQL with MySQL compatibility)
- **AI Integration:** Google Gemini 1.5 Flash (via Google Generative AI SDK)
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
- **Deployment:** Vercel (Frontend & Serverless Functions)

---

## 🚀 Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Thanuprakashgowda/Cloud-management-system.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=your_tidb_host
   DB_PORT=your_tidb_port
   DB_USER=your_tidb_user
   DB_PASSWORD=your_tidb_password
   DB_NAME=student_management_system
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Migrations:**
   Ensure the tables are created in your TiDB cluster using the `database/schema.sql`.

5. **Start the Server:**
   ```bash
   node server.js
   ```

---

## 👨‍💻 Developer
Developed with ❤️ by **Thanuprakash Gowda**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?logo=linkedin)](https://www.linkedin.com/in/thanuprakash-gowda/)

---
*Cloud SMS — Empowering Education through Technology.*
