const db = require("../config/db");
const validator = require("validator");

exports.createTransaction = (req, res) => {
  const { amount, recipient } = req.body;
  const trimmedRecipient = (recipient || "").trim();

  // Input validation
  if (
    !validator.isNumeric(amount + "") ||
    Number(amount) <= 0 ||
    !validator.isLength(trimmedRecipient, { min: 3, max: 30 }) ||
    !/^[a-zA-Z0-9 .]+$/.test(trimmedRecipient)
  ) {
    return res.status(400).send("Invalid transaction data");
  }

  // Role-based access control: Only 'user' and 'admin' can create transactions
  if (!["user", "admin"].includes(req.user.role)) {
    return res.status(403).send("Forbidden");
  }

  // Simulate transaction creation
  db.query(
    "INSERT INTO transactions (user_id, recipient, amount) VALUES (?, ?, ?)",
    [req.user.id, trimmedRecipient, amount],
    (err) => {
      if (err) return res.status(500).send("An error occurred");
      res.status(201).send("Transaction successful");
    }
  );
};

exports.getUserTransactions = (req, res) => {
  const userId = req.user.id;
  // Only show transactions for the logged-in user
  db.query(
    "SELECT recipient, amount, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      console.error('DB INSERT error:', err);  
      if (err) return res.status(500).send("An error occurred");
      res.json(results);
    }
  );
};
