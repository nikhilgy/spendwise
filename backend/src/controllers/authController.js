import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { supabase } from '../utils/database.js';

export const register = async (req, res) => {
  try {
    const { email, password, full_name, avatar_url } = req.body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({
        error: 'Email, password, and full name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      full_name,
      avatar_url
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Get user profile
    const user = await User.findById(data.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User profile not found'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to authenticate user',
      details: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        currency: user.currency,
        timezone: user.timezone
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to get user information',
      details: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { full_name, avatar_url, currency, timezone } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (avatar_url) updateData.avatar_url = avatar_url;
    if (currency) updateData.currency = currency;
    if (timezone) updateData.timezone = timezone;

    const user = await User.update(userId, updateData);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        currency: user.currency,
        timezone: user.timezone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      details: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    // For JWT-based auth, client should remove the token
    // For Supabase auth, we can sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
    }

    res.json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Failed to logout',
      details: error.message
    });
  }
}; 