require('dotenv').config();
const sql = require('./database/db.js');
const query = `CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present','absent','late') NOT NULL DEFAULT 'present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, date),
  INDEX idx_attendance_date (date)
)`;
sql.query(query, (err) => {
  if (err) { console.error('Error:', err.message); }
  else { console.log('✅ Attendance table created / already exists.'); }
  process.exit();
});
