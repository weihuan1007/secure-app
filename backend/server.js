require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const registerRoutes = require('./routes/register');

const app = express();
const allowedOrigins = ['https://secure-app-production-0d50.up.railway.app']; // Replace with your actual frontend URL

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, // Set to true with HTTPS
    httpOnly: true,
    maxAge: 15 * 60 * 1000 // 15 minutes
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/register', registerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
