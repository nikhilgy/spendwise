import express from 'express';
import { 
  createCard, 
  getCards, 
  getCardById, 
  updateCard, 
  deleteCard,
  getCardStats,
  getCardSuggestion
} from '../controllers/cardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Card CRUD routes
router.post('/', createCard);
router.get('/', getCards);
router.get('/stats', getCardStats);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

// Card suggestion route
router.post('/suggest', getCardSuggestion);

export default router; 