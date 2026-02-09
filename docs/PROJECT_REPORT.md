# Cloud-Based Student Management System
**Role**: Cloud Engineer / Backend Developer  
**Tech Stack**: AWS RDS (MySQL), AWS EC2 (Linux/Ubuntu), Node.js, SQL

---

## 1. Architecture

This project demonstrates a classic **2-Tier Cloud Architecture** hosting a Student Management System.

### Diagram
```mermaid
graph LR
    User[User / Client] -- HTTP/HTTPS --> EC2[AWS EC2 Instance\n(Web Server & SQL Client)]
    EC2 -- SQL Connection (Port 3306) --> RDS[AWS RDS\n(MySQL Database)]
```

### Why AWS RDS instead of Local MySQL?
1.  **Managed Service**: AWS handles patching, backups, and maintenance (No OS Admin work required).
2.  **Availability**: Easy to enable Multi-AZ for high availability (Disaster Recovery).
3.  **Scalability**: Can scale storage or compute power (Read Replicas) with a few clicks.
4.  **Security**: Data is encrypted at rest and in transit.

---

## 2. Database Design (Normalized)

The database is designed in **3rd Normal Form (3NF)** to reduce redundancy and ensure data integrity.

### Tables
1.  **Students** (`student_id`, `name`, `email`, `dob`) - Stores student profile.
2.  **Courses** (`course_id`, `course_name`, `credits`) - Stores subject details.
3.  **Enrollments** (`enroll_id`, `student_id`, `course_id`) - **Junction Table** linking Students and Courses (Many-to-Many relationship).
4.  **Marks** (`mark_id`, `enroll_id`, `marks`) - Stores academic results for an enrollment.

### Normalization Logic
-   **1NF**: All columns contain atomic values.
-   **2NF**: All non-key attributes depend on the *whole* primary key.
-   **3NF**: No transitive dependencies (e.g., Student table doesn't store Department Name directly, it links to a Department ID).

---

## 3. SQL Implementation & Optimization

### Optimization Techniques Used
-   **Primary Keys**: Automatically indexed for fast lookup (`student_id`, `course_id`...).
-   **Foreign Keys**: Enforce referential integrity (Cannot delete a Student if they have Enrollments).
-   **Indexes**: Added `idx_marks` to speed up queries filtering by marks (e.g., finding top scorers).

*(See `database/queries.sql` for the actual code implementing advanced analysis)*

---

## 4. Cloud Setup (Step-by-Step)

### Step 1: Create AWS RDS (MySQL)
1.  **Service**: RDS -> "Create Database".
2.  **Engine**: MySQL (Free Tier).
3.  **Connectivity**: "Public Access: Yes" (for direct connection) or "No" (connect via EC2).
4.  **Security Group**: Create one allowing Port 3306.

### Step 2: Create AWS EC2 (Application Server)
1.  **Service**: EC2 -> "Launch Instance".
2.  **OS**: Ubuntu 22.04 LTS.
3.  **Key Pair**: Download `.pem` file for SSH access.
4.  **Security Group**: Allow SSH (22) and HTTP (80/8080).

### Step 3: Connect EC2 to RDS
1.  SSH into EC2: `ssh -i key.pem ubuntu@<ec2-ip>`
2.  Install MySQL Client: `sudo apt install mysql-client`
3.  Connect:
    ```bash
    mysql -h <rds-endpoint> -u admin -p
    ```

---

## 5. Security & Optimization

### Security
1.  **Security Groups (Firewall)**:
    -   **EC2 SG**: Allow Inbound Port 80, 22.
    -   **RDS SG**: Allow Inbound Port 3306 **ONLY** from EC2 Security Group ID (Least Privilege).
2.  **IAM**: Created specific IAM users with specialized permissions (e.g., `RDSFullAccess`) instead of using Root Account.
3.  **Environment Variables**: Database credentials stored in `.env`, never hardcoded in git.

### Scaling Options
-   **Vertical Scaling**: Upgrade EC2 type (t2.micro -> t3.medium) for more CPU/RAM.
-   **Horizontal Scaling**: Add Read Replicas for RDS if read-heavy (reporting queries).

---

## 6. Interview Q&A

**Q: Explain a complex SQL query you wrote.**
*A: "I used a Window Function `DENSE_RANK()` to rank students within each course based on their marks. This handles ties gracefully (e.g., two students with 90 both get Rank 1) compared to standard `ORDER BY`."*

**Q: How do you secure the database in the cloud?**
*A: "I placed the RDS instance in a private subnet (conceptually) and configured the Security Group to ONLY accept traffic from the EC2 instance's IP/Security Group. I also enabled IAM authentication and encrypted storage."*

**Q: What involves 'Normalization'?**
*A: "It's the process of organizing data to reduce redundancy. For example, instead of storing 'Course Name' in the Student table (repeating it 100 times), I moved it to a separate 'Courses' table and linked them via ID. This makes updates easier and saves space."*
