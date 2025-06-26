import { Card } from '../models/Card.js';

export const createCard = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { name, issuer, last_four, card_type, billing_cycle_day, reward_rules } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!name || !issuer || !last_four || !card_type) {
      return res.status(400).json({
        error: 'Name, issuer, last_four, and card_type are required'
      });
    }

    const cardData = {
      user_id: userId,
      name,
      issuer,
      last_four,
      card_type,
      billing_cycle_day: billing_cycle_day || null,
      reward_rules: reward_rules || {}
    };

    const card = await Card.create(cardData);

    res.status(201).json({
      message: 'Card created successfully',
      card
    });
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({
      error: 'Failed to create card',
      details: error.message
    });
  }
};

export const getCards = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { card_type, is_active } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const options = {};
    if (card_type) options.cardType = card_type;
    if (is_active !== undefined) options.isActive = is_active === 'true';

    const cards = await Card.findByUserId(userId, options);

    res.json({
      cards,
      count: cards.length
    });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({
      error: 'Failed to get cards',
      details: error.message
    });
  }
};

export const getCardById = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const card = await Card.findById(id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Card not found'
      });
    }

    if (card.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json({ card });
  } catch (error) {
    console.error('Get card by id error:', error);
    res.status(500).json({
      error: 'Failed to get card',
      details: error.message
    });
  }
};

export const updateCard = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if card exists and belongs to user
    const existingCard = await Card.findById(id);
    if (!existingCard) {
      return res.status(404).json({
        error: 'Card not found'
      });
    }

    if (existingCard.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const card = await Card.update(id, updateData);

    res.json({
      message: 'Card updated successfully',
      card
    });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({
      error: 'Failed to update card',
      details: error.message
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if card exists and belongs to user
    const existingCard = await Card.findById(id);
    if (!existingCard) {
      return res.status(404).json({
        error: 'Card not found'
      });
    }

    if (existingCard.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await Card.delete(id);

    res.json({
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({
      error: 'Failed to delete card',
      details: error.message
    });
  }
};

export const getCardStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const stats = await Card.getStats(userId);

    res.json({ stats });
  } catch (error) {
    console.error('Get card stats error:', error);
    res.status(500).json({
      error: 'Failed to get card stats',
      details: error.message
    });
  }
};

export const getCardSuggestion = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { merchant, category, amount } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!merchant && !category) {
      return res.status(400).json({
        error: 'Merchant or category is required'
      });
    }

    const transactionData = { merchant, category, amount };
    const suggestion = await Card.findBestCardForTransaction(userId, transactionData);

    res.json({ suggestion });
  } catch (error) {
    console.error('Get card suggestion error:', error);
    res.status(500).json({
      error: 'Failed to get card suggestion',
      details: error.message
    });
  }
}; 