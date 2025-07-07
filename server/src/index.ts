import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request size limits for security
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Financial Analytics API is running!");
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler:", err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: "Validation error",
      details: err.message
    });
    return;
  }
  
  if (err.name === 'CastError') {
    res.status(400).json({
      error: "Invalid data format",
      details: err.message
    });
    return;
  }
  
  if (err.code === 11000) {
    res.status(409).json({
      error: "Duplicate entry",
      details: "This record already exists"
    });
    return;
  }
  
  // Default error response
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong"
  });
};

app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    
    // Start server only after DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}`);
      console.log(`🔍 Health check at http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});