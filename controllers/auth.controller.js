const sql = require("../database/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { school_name, email, password } = req.body;
        
        if (!school_name || !email || !password) {
            return res.status(400).send({ message: "Content can not be empty!" });
        }

        // Check if admin already exists
        const checkQuery = "SELECT * FROM administrators WHERE email = ?";
        sql.query(checkQuery, [email], async (err, result) => {
            if (err) return res.status(500).send({ message: err.message });
            if (result.length > 0) return res.status(400).send({ message: "Email already exists" });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Insert new Admin
            const admin = { school_name, email, password_hash };
            sql.query("INSERT INTO administrators SET ?", admin, (err, data) => {
                if (err) return res.status(500).send({ message: err.message });
                res.status(201).send({ message: "School Registered Successfully!" });
            });
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    const query = "SELECT * FROM administrators WHERE email = ?";
    sql.query(query, [email], async (err, result) => {
        if (err) return res.status(500).send({ message: err.message });
        if (result.length === 0) return res.status(404).send({ message: "Administrator not found" });

        const admin = result[0];
        
        // Compare password with hash
        const passwordIsValid = await bcrypt.compare(password, admin.password_hash);
        
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null, message: "Invalid Password" });
        }

        // Generate Token
        const token = jwt.sign({ id: admin.admin_id }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({ auth: true, token: token, school: admin.school_name });
    });
};

exports.getProfile = (req, res) => {
    // req.adminId is injected by verifyToken middleware
    const query = "SELECT school_name, email, created_at FROM administrators WHERE admin_id = ?";
    sql.query(query, [req.adminId], (err, result) => {
        if (err) return res.status(500).send({ message: err.message });
        if (!result.length) return res.status(404).send({ message: "Admin not found" });
        res.status(200).send(result[0]);
    });
};
