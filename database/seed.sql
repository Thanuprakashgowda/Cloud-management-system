-- Seed Data for Student Management System
USE student_management_system;

-- specific cleanup for re-seeding (optional, be careful in production)
-- DELETE FROM enrollments;
-- DELETE FROM students;
-- DELETE FROM courses;
-- DELETE FROM departments;

-- Insert Departments
INSERT INTO departments (department_name, head_of_dept) VALUES 
('Computer Science', 'Dr. Alice Johnson'),
('Electrical Engineering', 'Prof. Bob Smith'),
('Mechanical Engineering', 'Dr. Charlie Brown');

-- Insert Courses
INSERT INTO courses (course_name, credits, department_id) VALUES 
('Database Management Systems', 4, 1),
('Data Structures & Algorithms', 4, 1),
('Circuit Analysis', 3, 2),
('Thermodynamics', 3, 3),
('Cloud Computing', 3, 1);

-- Insert Students
INSERT INTO students (first_name, last_name, email, dob, department_id) VALUES 
('John', 'Doe', 'john.doe@example.com', '2000-05-15', 1),
('Jane', 'Smith', 'jane.smith@example.com', '2001-08-22', 2),
('Mike', 'Ross', 'mike.ross@example.com', '1999-11-30', 1),
('Rachel', 'Zane', 'rachel.zane@example.com', '2000-02-14', 3),
('Harvey', 'Specter', 'harvey.specter@example.com', '1998-01-01', 1);

-- Insert Enrollments
INSERT INTO enrollments (student_id, course_id, enrollment_date, grade) VALUES 
(1, 1, '2023-09-01', 'A'), -- John in DBMS
(1, 2, '2023-09-01', 'B+'), -- John in DSA
(2, 3, '2023-09-02', 'A-'), -- Jane in Circuits
(3, 5, '2023-09-03', 'A'), -- Mike in Cloud Computing
(4, 4, '2023-09-04', 'B'), -- Rachel in Thermodynamics
(5, 1, '2023-09-01', 'A+'); -- Harvey in DBMS

-- Insert Marks (Linked to Enrollments)
INSERT INTO marks (enrollment_id, marks) VALUES 
(1, 85), -- John (DBMS)
(2, 78), -- John (DSA)
(3, 92), -- Jane (Circuits)
(4, 88), -- Mike (Cloud)
(5, 75), -- Rachel (Thermo)
(6, 95); -- Harvey (DBMS)
