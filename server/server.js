require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const contentRoutes = require("./routes/contentRoutes");
const { connectDB } = require("./config/database");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Running in fallback mode with mock data');
  });

// Middleware to check database connection
app.use((req, res, next) => {
  if (!dbConnected && req.path.startsWith('/api/')) {
    // For API routes, return mock data structure
    return res.status(200).json({
      mock: true,
      data: {},
      message: 'Using mock data - database unavailable'
    });
  }
  next();
});

// API Routes
app.use('/api/content', contentRoutes);

// Basic Routes
app.use(basicRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (dbConnected) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});