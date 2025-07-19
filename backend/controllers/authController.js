const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (
    !validator.isAlphanumeric(username || '') ||
    !validator.isLength(username || '', { min: 3, max: 30 }) ||
    !validator.isLength(password || '', { min: 6, max: 100 })
  ) {
    return res.status(400).send('Invalid input');
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('An error occurred');
    if (!results.length) return res.status(401).send('Authentication failed');

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).send('Authentication failed');

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    req.session.regenerate((err) => {
      if (err) return res.status(500).send('Session error');
      req.session.userId = user.id;
      console.log('User details in session.regenerate:', user); // Log user details here
      res.json({
        token: token,
        username: user.username,
        email: user.email
      });
    });
  });
};

exports.getUser = (req, res) => {
  // req.user is set by authMiddleware
  const userId = req.user.id;
  // Only fetch safe fields
  db.query('SELECT username, email, role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send('An error occurred');
    if (!results.length) return res.status(404).send('User not found');
    const user = results[0];
    res.json({
      username: user.username,
      email: user.email,
      role: user.role
    });
  });
};