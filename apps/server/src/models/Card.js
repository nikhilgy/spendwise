import { getRow, getRows, insertRow, updateRow, deleteRow } from '../utils/database.js';

export class Card {
  static async create(cardData) {
    try {
      const data = {
        ...cardData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return await insertRow('cards', data);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await getRow('cards', { id });
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, options = {}) {
    try {
      const filters = { user_id: userId };
      
      if (options.isActive !== undefined) {
        filters.is_active = options.isActive;
      }
      if (options.cardType) {
        filters.card_type = options.cardType;
      }

      return await getRows('cards', filters, {
        orderBy: { column: 'created_at', ascending: false },
        limit: options.limit || 50,
        offset: options.offset || 0,
        ...options
      });
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const data = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      return await updateRow('cards', id, data);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await deleteRow('cards', id);
    } catch (error) {
      throw error;
    }
  }

  static async getStats(userId) {
    try {
      const cards = await this.findByUserId(userId, { isActive: true });
      
      const stats = {
        totalCards: cards.length,
        creditCards: cards.filter(card => card.card_type === 'credit').length,
        debitCards: cards.filter(card => card.card_type === 'debit').length,
        issuers: [...new Set(cards.map(card => card.issuer))],
        totalRewardRules: cards.reduce((sum, card) => {
          const rules = card.reward_rules || {};
          return sum + Object.keys(rules).length;
        }, 0)
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  static async findBestCardForTransaction(userId, transactionData) {
    try {
      const cards = await this.findByUserId(userId, { isActive: true, cardType: 'credit' });
      
      let bestCard = null;
      let bestRewardRate = 0;

      for (const card of cards) {
        const rules = card.reward_rules || {};
        
        // Check if any reward rules match the transaction
        for (const [category, rewardRate] of Object.entries(rules)) {
          if (transactionData.category?.toLowerCase().includes(category.toLowerCase()) ||
              transactionData.merchant?.toLowerCase().includes(category.toLowerCase())) {
            if (rewardRate > bestRewardRate) {
              bestRewardRate = rewardRate;
              bestCard = card;
            }
          }
        }
      }

      return {
        bestCard,
        bestRewardRate,
        suggestion: bestCard ? 
          `Use ${bestCard.name} for ${bestRewardRate}% cashback` : 
          'No better card found for this transaction'
      };
    } catch (error) {
      throw error;
    }
  }
} 