const db = require('../config/db');
const bcrypt = require('bcryptjs');
const validator = require('validator');

exports.register = (req, res) => {
  const { username, password, email, role } = req.body;

  // Input validation
  if (
    !validator.isAlphanumeric(username || '') ||
    !validator.isLength(username || '', { min: 3, max: 30 }) ||
    !validator.isLength(password || '', { min: 6, max: 100 }) ||
    !validator.isEmail(email || '') ||
    (role && !['user', 'admin'].includes(role))
  ) {
    return res.status(400).send('Invalid input');
  }

  // Output sanitization
  const safeUsername = validator.escape(username);
  const safeEmail = validator.normalizeEmail(email);

  // Check if user exists
  db.query('SELECT * FROM users WHERE username = ?', [safeUsername], async (err, results) => {
    if (err) return res.status(500).send('An error occurred');
    if (results.length) return res.status(409).send('Username already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [safeUsername, hashedPassword, safeEmail, role || 'user'],
      (err) => {
        if (err) return res.status(500).send('Registration failed');
        res.status(201).send('Registration successful');
      }
    );
  });
};