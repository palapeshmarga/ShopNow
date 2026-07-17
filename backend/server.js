global.crypto = require('crypto');

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Defined at the top now so everything can use it safely

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Link Product Routes
app.use('/api/products', require('./routes/productRoutes'));

// Link User Routes
app.use('/api/users', require('./routes/userRoutes'));

// Link Order Routes (Removed the duplicate entry)
app.use('/api/orders', require('./routes/orderRoutes'));

// Define frontend build path cleanly
const frontendBuildPath = path.join(__dirname, '../frontend/dist');

// Serve the static assets from the frontend build folder
app.use(express.static(frontendBuildPath));

// Fallback mechanism: redirect any unmatched client-side page loads back to the React index page safely
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB.');
        
        // Listen to port cleanly now that all routes are configured safely above
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error.message);
    });