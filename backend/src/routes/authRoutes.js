const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/me', authRequired, async (req, res) => {
  const user = await User.findById(req.user.id).select('_id name email');
  res.json(user);
});

module.exports = router;


