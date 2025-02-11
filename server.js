require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobs');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration with allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:19000',          // Expo development
  'http://localhost:19006',          // Expo web
  'exp://localhost:19000',           // Expo Go app
  'https://*.expo.dev',              // Expo production
  'https://*.expo.io',               // Expo production (legacy)
  process.env.FRONTEND_URL           // Your production frontend URL
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        return origin.match(new RegExp(allowedOrigin.replace('*', '.*')));
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});