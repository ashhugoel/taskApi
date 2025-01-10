const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { sendVerificationEmail } = require('../utils/email');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key';

// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
});

// Forget Password
router.post('/forgot-password/send-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
});

router.post('/forgot-password/verify-code', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
});

module.exports = router;
