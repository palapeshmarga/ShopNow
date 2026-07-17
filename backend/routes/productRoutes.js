const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assuming your model is named Product
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a single product
// @route   POST /api/products
// @access  Public (We will make this Admin-only later!)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, price, image, category, countInStock, description } = req.body;

        const product = new Product({
            name,
            price,
            image,
            category,
            countInStock,
            description
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a single product
// @route   DELETE /api/products/:id
// @access  Public (Will be Admin-only later)
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product successfully removed from store' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a single product
// @route   PUT /api/products/:id
// @access  Public (Will be Admin-only later)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.price = req.body.price !== undefined ? req.body.price : product.price;
            product.image = req.body.image || product.image;
            product.category = req.body.category || product.category;
            product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;
            product.description = req.body.description || product.description;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;