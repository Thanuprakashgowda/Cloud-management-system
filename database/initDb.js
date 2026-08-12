const sql = require("./db.js");

const alterQueries = [
    "ALTER TABLE administrators ADD COLUMN institution_type VARCHAR(50) DEFAULT 'School'",
    "ALTER TABLE departments ADD COLUMN admin_id INT",
    "ALTER TABLE courses ADD COLUMN admin_id INT",
    "ALTER TABLE students ADD COLUMN admin_id INT"
];

function runMigrations() {
    alterQueries.forEach(query => {
        sql.query(query, (err) => {
            if (err) {
                // Ignore error if column already exists (MySQL code 1060 / ER_DUP_FIELDNAME)
                if (err.errno === 1060 || err.code === 'ER_DUP_FIELDNAME' || (err.message && err.message.toLowerCase().includes('duplicate column'))) {
                    // Column already exists - no action needed
                } else {
                    console.log("Migration notice:", err.message);
                }
            } else {
                console.log("Schema migration executed successfully:", query);
            }
        });
    });
}

runMigrations();

module.exports = runMigrations;
