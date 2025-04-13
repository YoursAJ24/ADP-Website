const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());  // Security headers
app.use(morgan('combined'));  // HTTP request logging
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello from the backend');
});

// Routes
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const inventoryRoutes = require('./routes/inventory');
app.use('/api/inventorys', inventoryRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong! Please try again later.' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
