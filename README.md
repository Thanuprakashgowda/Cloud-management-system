# Cloud-Based Student Management System

A full-stack Student Management System built with **Node.js, Express, and MySQL (AWS RDS)**. This project demonstrates cloud database integration, RESTful API design, and clean code architecture.

## 🚀 Features
-   **Cloud Database**: Uses AWS RDS for a scalable MySQL backend.
-   **CRUD Operations**: Create, Read, Update, and Delete students.
-   **Relational Schema**: Manages Students, Departments, Courses, and Enrollments.
-   **Responsive UI**: Clean dashboard built with HTML5 & CSS3.

## 🛠️ Tech Stack
-   **Frontend**: HTML, CSS, JavaScript (Fetch API)
-   **Backend**: Node.js, Express.js
-   **Database**: MySQL (AWS RDS)
-   **Tools**: Postman (Testing), VS Code

## 📂 Project Structure
```
├── config/             # Database configuration
├── controllers/        # Business logic
├── database/           # SQL scripts (Schema, Seed, Queries)
├── docs/               # Documentation (Setup, Interview Guide)
├── public/             # Frontend files (HTML, CSS, JS)
├── routes/             # API routes
├── server.js           # Entry point
└── .env                # Environment variables
```

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
You can use a local MySQL server or AWS RDS.
1.  Create a `.env` file in the root directory.
2.  Add your database credentials:
    ```env
    DB_HOST=your-db-host
    DB_USER=your-db-user
    DB_PASSWORD=your-db-password
    DB_NAME=student_management_system
    ```
3.  Run the SQL scripts in `database/` to create tables and tables.

### 3. Run the Server
```bash
node server.js
```
Access the frontend at `http://localhost:8080`.

## 📚 Documentation
-   [AWS RDS Setup Guide](docs/AWS_RDS_SETUP.md)
-   [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
-   [Interview Guide](docs/INTERVIEW_GUIDE.md)
