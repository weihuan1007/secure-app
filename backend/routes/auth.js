const express = require('express');
const { login, getUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.get('/user', authenticate, getUser); // <-- Add this line

module.exports = router;
