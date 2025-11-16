require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateRoutes = require('./routes/rates'); // Import the routes
const currencyRoutes = require('./routes/currencies'); // Import the new currency routes

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rates', rateRoutes); // Use the routes
app.use('/api/currencies', currencyRoutes); // Add the new currency routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});