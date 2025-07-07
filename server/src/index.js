"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}
const app = (0, express_1.default)();
// Enhanced CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Request size limits for security
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Routes
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
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
const errorHandler = (err, req, res, next) => {
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
mongoose_1.default
    .connect(process.env.MONGO_URI)
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
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGTERM received, shutting down gracefully');
    try {
        yield mongoose_1.default.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGINT received, shutting down gracefully');
    try {
        yield mongoose_1.default.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
}));
