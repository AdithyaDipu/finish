require('dotenv').config();
const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  const { role, firstName, lastName, email, phone, address, zipCode, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash password automatically via schema
    const newUser = new User({
      role,
      firstName,
      lastName,
      email,
      phone,
      address,
      zipCode,
      password,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { _id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { _id: newUser._id, email: newUser.email, role: newUser.role },
    });

  } catch (error) {
    console.error('❌ Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, email: user.email, phone: user.phone,  role: user.role , firstName: user.firstName },
    });

  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;