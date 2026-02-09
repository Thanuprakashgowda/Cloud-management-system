-- SQL Queries for Student Management System
-- Use this to demonstrate SQL proficiency in interviews.
USE student_management_system;

-- 1. Insert Sample Data
-- (See seed.sql for the bulk insert statements)

-- 2. Retrieve Top-Scoring Student (Using Subquery)
SELECT s.first_name, s.last_name, c.course_name, m.marks
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
JOIN marks m ON e.enrollment_id = m.enrollment_id
WHERE m.marks = (SELECT MAX(marks) FROM marks);

-- 3. Course-wise Average Marks
SELECT 
    c.course_name, 
    ROUND(AVG(m.marks), 2) as average_marks
FROM courses c
JOIN enrollments e ON c.course_id = e.course_id
JOIN marks m ON e.enrollment_id = m.enrollment_id
GROUP BY c.course_name;

-- 4. Rank Students using Window Functions (Top 3 in each course)
SELECT 
    s.first_name,
    c.course_name,
    m.marks,
    DENSE_RANK() OVER (PARTITION BY c.course_name ORDER BY m.marks DESC) as 'Rank'
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
JOIN marks m ON e.enrollment_id = m.enrollment_id;

-- 5. Find Students who scored Above Average in their course
SELECT 
    s.first_name, 
    s.last_name, 
    c.course_name, 
    m.marks,
    (SELECT AVG(marks) FROM marks m2 JOIN enrollments e2 ON m2.enrollment_id = e2.enrollment_id WHERE e2.course_id = c.course_id) as course_avg
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
JOIN marks m ON e.enrollment_id = m.enrollment_id
WHERE m.marks > (
    SELECT AVG(marks) 
    FROM marks m2 
    JOIN enrollments e2 ON m2.enrollment_id = e2.enrollment_id 
    WHERE e2.course_id = c.course_id
);

-- 6. Analysis with Indexes (Explain Plan)
-- Run this in MySQL Workbench to see how 'idx_marks' is used.
EXPLAIN SELECT * FROM marks WHERE marks > 90;
