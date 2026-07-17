const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); // Imported clean!

// Helper function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d', // Token lasts for 30 days
    });
};

// Middleware to protect routes - Verifies the logged-in user's token
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed!
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

/* const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split the "Bearer <token>" string to get just the token
      token = req.headers.authorization.split(' ')[1];
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Find the user in the DB and attach them to the request object (minus their password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Keep going to the route handler!
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token available' });
  }
};
*/

// @desc    Register a new user
// @route   POST /api/users/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) { user.password = req.body.password; }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' }),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Get all users for admin review
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      // Find all users, but don't send their password hashes over the network
      const users = await User.find({}).select('-password');
      res.json(users);
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;