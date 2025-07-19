const express = require('express');
const { createTransaction, getUserTransactions } = require('../controllers/transactionController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createTransaction);
router.get('/', authenticate, getUserTransactions); // Add this line

module.exports = router;