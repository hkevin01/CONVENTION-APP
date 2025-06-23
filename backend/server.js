const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const eventRoutes = require('./src/routes/events');
const announcementRoutes = require('./src/routes/announcements');
const profileRoutes = require('./src/routes/profile');
const ticketRoutes = require('./src/routes/tickets');
const favoriteRoutes = require('./src/routes/favorites');
const notificationRoutes = require('./src/routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined. Check your .env file');
  process.exit(1);
}

// Add connection options with retry
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

// Connection with fallback
mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    
    // If running in development mode, we can continue without MongoDB
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_NO_MONGO === 'true') {
      console.warn('Running in development mode without MongoDB. Some features will be limited.');
    } else {
      console.error('MongoDB connection failed. Check if MongoDB is running or update your connection string.');
      console.log('To run without MongoDB in development, set ALLOW_NO_MONGO=true in your .env file');
      process.exit(1);
    }
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Convention App API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
