# Expected SQL Query Outputs

This document shows the **expected results** when you run the `database/queries.sql` script on your AWS RDS instance, based on the sample data in `seed.sql`.

Use this to verify your project is working correctly.

---

### 1. Retrieve Top-Scoring Student
*Query finds the student with the maximum marks (95).*

| first_name | last_name | course_name                 | marks |
| :---       | :---      | :---                        | :---  |
| Harvey     | Specter   | Database Management Systems | 95    |

---

### 2. Course-wise Average Marks
*Calculates the average score for each course.*

| course_name                 | average_marks |
| :---                        | :---          |
| Database Management Systems | 90.00         |
| Data Structures & Algorithms| 78.00         |
| Circuit Analysis            | 92.00         |
| Cloud Computing             | 88.00         |
| Thermodynamics              | 75.00         |

---

### 3. Rank Students (Dense Rank)
*Ranks students within each course. Note how in DBMS, Harvey is #1 and John is #2.*

| first_name | course_name                 | marks | Rank |
| :---       | :---                        | :---  | :--- |
| Harvey     | Database Management Systems | 95    | 1    |
| John       | Database Management Systems | 85    | 2    |
| Jane       | Circuit Analysis            | 92    | 1    |
| Mike       | Cloud Computing             | 88    | 1    |
| John       | Data Structures & Algorithms| 78    | 1    |
| Rachel     | Thermodynamics              | 75    | 1    |

---

### 4. Students Scoring Above Course Average
*Finds students who performed better than the average of their class.*
*(Only Harvey appears because he scored 95, which is higher than the DBMS class average of 90).*

| first_name | last_name | course_name                 | marks | course_avg |
| :---       | :---      | :---                        | :---  | :---       |
| Harvey     | Specter   | Database Management Systems | 95    | 90.0000    |

---

### 5. Analysis (Explain Plan)
*Output of `EXPLAIN SELECT * FROM marks WHERE marks > 90;`*
*This proves the `idx_marks` index is being used.*

| id | select_type | table | partitions | type  | possible_keys | key       | key_len | ref  | rows | Extra                 |
| :- | :---        | :---  | :---       | :---  | :---          | :---      | :---    | :--- | :--- | :---                  |
| 1  | SIMPLE      | marks | NULL       | range | idx_marks     | idx_marks | 5       | NULL | 2    | Using index condition |

*(Note the `key` column says `idx_marks`, showing the optimization is active!)*
