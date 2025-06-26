import express from 'express';
import { getCurrentUser, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/profile', getCurrentUser);
router.put('/profile', updateProfile);

export default router; 