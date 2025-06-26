import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile, 
  logout 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router; 