const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ 
      message: 'All fields are required',
      errors: {
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null,
        name: !name ? 'Name is required' : null
      }
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Invalid email format',
      errors: { email: 'Please enter a valid email address' }
    });
  }
  
  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password too short',
      errors: { password: 'Password must be at least 6 characters long' }
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required',
      errors: {
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      }
    });
  }
  
  next();
};

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User already exists',
        errors: { email: 'An account with this email already exists' }
      });
    }
    
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashed, name });
    await user.save();
    
    // Generate token for immediate login
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: 'Internal server error' 
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        errors: { email: 'No account found with this email' }
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        errors: { password: 'Incorrect password' }
      });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: 'Internal server error' 
    });
  }
});

// Token verification endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.json({ 
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
