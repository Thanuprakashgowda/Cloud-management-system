# Interview Guide: Cloud-Based Student Management System

Use this guide to explain your project during interviews. It covers the technical decisions, architecture, and potential questions.

## Project Overview
"I built a full-stack Student Management System using Node.js and Express for the backend, and AWS RDS (MySQL) for the database. The frontend is a responsive dashboard built with vanilla HTML/CSS/JS. The system handles full CRUD operations for students and manages relationships between students, courses, and departments."

## Key Technical Concepts

### 1. Database Schema & Normalization
*   **Concept**: 3rd Normal Form (3NF).
*   **Application**: I separated data into `Students`, `Courses`, `Departments`, and `Enrollments` tables to reduce redundancy.
*   **Relationships**:
    -   **One-to-Many**: Department -> Students (A department has many students).
    -   **Many-to-Many**: Students <-> Courses (Managed via the `Enrollments` junction table).

### 2. Cloud Integration (AWS RDS)
*   **Why AWS RDS?**: It's a managed service that handles backups, patching, and scaling automatically.
*   **Connection**: The Node.js application connects to the RDS endpoint using the `mysql2` driver. I configured Security Groups to allow inbound traffic from my IP address.

### 3. Backend Architecture (MVC Pattern)
*   **Model**: The database schema and SQL queries.
*   **View**: The frontend HTML/CSS.
*   **Controller**: `student.controller.js` handles the business logic (validating requests, calling the database).
*   **Routes**: `student.routes.js` maps HTTP methods (GET, POST, etc.) to controller functions.

### 4. RESTful API Design
*   Used standard HTTP methods:
    -   `GET /api/students`: Retrieve list.
    -   `POST /api/students`: Create new.
    -   `DELETE /api/students/:id`: Remove.

## Common Interview Questions

**Q: Why use `mysql2` instead of `mysql`?**
A: `mysql2` supports Promises and async/await, which makes the code cleaner and easier to manage compared to callback hell. It also supports Prepared Statements for security.

**Q: How did you handle security?**
A:
1.  **SQL Injection**: Used parameterized queries (e.g., `WHERE id = ?`) provided by `mysql2`.
2.  **Environment Variables**: Stored sensitive credentials (DB host, password) in a `.env` file, not in the source code.
3.  **CORS**: Configured CORS to allow only specific origins (currently all for dev, but can be restricted).

**Q: How would you scale this application?**
A:
1.  **Database**: Use Read Replicas in RDS to offload read traffic.
2.  **Backend**: Deploy Node.js on ECS or EC2 with a Load Balancer. Use `pm2` ensures the process restarts on failure.
3.  **Caching**: Implement Redis to cache frequent queries (e.g., getting all departments).

**Q: Explain the `Enrollments` table.**
A: It's a junction table (associative entity) that resolves the Many-to-Many relationship between Students and Courses. It also holds attributes specific to the relationship, like `grade` and `enrollment_date`.
