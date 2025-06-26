import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { supabase, insertRow, updateRow } from '../utils/database.js';

export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

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

    // Create user in public.users
    const user = await User.create({
      email,
      password,
      full_name
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
        full_name: user.full_name
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

    // Authenticate using public.users
    const user = await User.authenticate(email, password);

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
    res.status(401).json({
      error: 'Invalid credentials',
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

export const googleAuth = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      // If no code, redirect to initiate
      return res.redirect('/api/auth/google/initiate');
    }

    // Exchange code for tokens using Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Google OAuth error:', error);
      return res.status(400).json({
        error: 'Failed to authenticate with Google',
        details: error.message
      });
    }

    // Get user profile from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(data.access_token);
    
    if (userError || !user) {
      return res.status(400).json({
        error: 'Failed to get user information'
      });
    }

    // Check if user profile exists in our database
    let userProfile = await User.findById(user.id);
    
    if (!userProfile) {
      // Create user profile if it doesn't exist
      const profileData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url || null,
        currency: 'USD',
        timezone: 'UTC'
      };
      
      userProfile = await insertRow('users', profileData);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userProfile.id, email: userProfile.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.CORS_ORIGIN}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userProfile))}`;
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      error: 'Failed to authenticate with Google',
      details: error.message
    });
  }
};

export const googleAuthInitiate = async (req, res) => {
  try {
    // Create OAuth URL with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.CORS_ORIGIN}/api/auth/google`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return res.status(400).json({
        error: 'Failed to initiate Google OAuth',
        details: error.message
      });
    }

    // Redirect to Google OAuth
    res.redirect(data.url);
    
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    res.status(500).json({
      error: 'Failed to initiate Google OAuth',
      details: error.message
    });
  }
}; 