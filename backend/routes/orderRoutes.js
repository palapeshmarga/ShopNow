const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Or whatever your Order model is named
const { protect, admin } = require('../middleware/authMiddleware'); // <-- Add this!


// @desc    Create a new order & update inventory stock
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, totalPrice, isPaid, paidAt } = req.body;
  const Product = require('../models/Product'); // Ensure the Product model is imported inside the file or route

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    try {
      // 1. Create and save the new order transaction record
      const order = new Order({
        user: req.user._id,
        orderItems,
        totalPrice,
        isPaid: isPaid || false,
        paidAt: paidAt || null
      });

      const createdOrder = await order.save();

      // 2. Loop through every item purchased and deduct its quantity from the inventory count
      for (const item of orderItems) {
        const product = await Product.findById(item.product);

        if (product) {
          // Subtract the quantity purchased from the existing count in stock
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          await product.save();
        }
      }

      // 3. Return the successfully created order confirmation response
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      // Find all orders and explicitly request the 'name' and 'email' fields from the User document
      const orders = await Order.find({}).populate('user', 'name email');
      res.json(orders);
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Update order status to processed/delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      const order = await Order.findById(req.params.id);

      if (order) {
        // Toggle the delivery/processing status
        order.isDelivered = true;
        order.deliveredAt = new Date();
        
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;