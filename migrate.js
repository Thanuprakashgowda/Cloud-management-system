require('dotenv').config();
const sql = require('./database/db.js');

const migrations = [
    // Add admin_id to students
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS admin_id INT, ADD KEY idx_students_admin (admin_id)`,
    // Add admin_id to courses  
    `ALTER TABLE courses ADD COLUMN IF NOT EXISTS admin_id INT, ADD KEY idx_courses_admin (admin_id)`,
    // Add admin_id to departments
    `ALTER TABLE departments ADD COLUMN IF NOT EXISTS admin_id INT, ADD KEY idx_departments_admin (admin_id)`,
    // Rename school_name to institution_name in administrators
    `ALTER TABLE administrators ADD COLUMN IF NOT EXISTS institution_type VARCHAR(30) DEFAULT 'School'`,
];

let done = 0;
migrations.forEach((q, i) => {
    sql.query(q, (err) => {
        if (err && !err.message.includes('Duplicate')) {
            console.error(`Migration ${i+1} error:`, err.message);
        } else {
            console.log(`✅ Migration ${i+1} OK`);
        }
        done++;
        if (done === migrations.length) {
            console.log('All migrations complete.');
            process.exit();
        }
    });
});
