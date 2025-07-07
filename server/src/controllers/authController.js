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
exports.getProfile = exports.login = exports.register = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Validation helper functions
const validateUsername = (username) => {
    if (!username || typeof username !== 'string') {
        return "Username is required and must be a string";
    }
    if (username.trim().length < 3) {
        return "Username must be at least 3 characters long";
    }
    if (username.trim().length > 30) {
        return "Username must be less than 30 characters";
    }
    // Check for valid characters (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return "Username can only contain letters, numbers, and underscores";
    }
    return null;
};
const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return "Password is required and must be a string";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long";
    }
    if (password.length > 100) {
        return "Password must be less than 100 characters";
    }
    return null;
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Input validation
        const usernameError = validateUsername(username);
        if (usernameError) {
            return res.status(400).json({
                error: usernameError,
                field: 'username'
            });
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({
                error: passwordError,
                field: 'password'
            });
        }
        // Check if user already exists
        const existingUser = yield Users_1.default.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(409).json({
                error: "Username already exists. Please choose a different username.",
                field: 'username'
            });
        }
        // Hash password with higher salt rounds for better security
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        // Create new user
        const user = new Users_1.default({
            username: username.trim(),
            password: hashedPassword
        });
        yield user.save();
        // Return success response (don't include password)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username
            }
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        // Handle specific database errors
        if (err instanceof Error && err.message.includes('duplicate key')) {
            return res.status(409).json({
                error: "Username already exists. Please choose a different username.",
                field: 'username'
            });
        }
        res.status(500).json({
            error: "Failed to register user. Please try again later."
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Input validation
        const usernameError = validateUsername(username);
        if (usernameError) {
            return res.status(400).json({
                error: usernameError,
                field: 'username'
            });
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({
                error: passwordError,
                field: 'password'
            });
        }
        // Find user by username
        const user = yield Users_1.default.findOne({ username: username.trim() });
        if (!user) {
            return res.status(401).json({
                error: "Invalid username or password",
                field: 'credentials'
            });
        }
        // Verify password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid username or password",
                field: 'credentials'
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            username: user.username
        }, process.env.JWT_SECRET, { expiresIn: "24h" });
        // Return success response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            error: "Failed to login. Please try again later."
        });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // req.user is set by the auth middleware
        const user = yield Users_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user, message: "Profile retrieved successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve profile. Please try again later." });
    }
});
exports.getProfile = getProfile;
