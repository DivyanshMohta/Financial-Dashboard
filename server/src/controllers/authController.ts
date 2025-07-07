import { Request, Response } from "express";
import User from "../models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";

// Validation helper functions
const validateUsername = (username: string): string | null => {
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

const validatePassword = (password: string): string | null => {
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

export const register = async (req: Request, res: Response) => {
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
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(409).json({ 
        error: "Username already exists. Please choose a different username.",
        field: 'username'
      });
    }

    // Hash password with higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const user = new User({ 
      username: username.trim(), 
      password: hashedPassword 
    });
    await user.save();

    // Return success response (don't include password)
    res.status(201).json({ 
      message: "User registered successfully",
      user: { 
        id: user._id, 
        username: user.username 
      }
    });

  } catch (err) {
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
};

export const login = async (req: Request, res: Response) => {
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
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid username or password",
        field: 'credentials'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: "Invalid username or password",
        field: 'credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username 
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "24h" }
    );

    // Return success response
    res.json({ 
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        username: user.username 
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      error: "Failed to login. Please try again later." 
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user, message: "Profile retrieved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve profile. Please try again later." });
  }
};