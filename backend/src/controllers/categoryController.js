import { Category } from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { name, icon, color, type } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!name || !type) {
      return res.status(400).json({
        error: 'Name and type are required'
      });
    }

    const categoryData = {
      user_id: userId,
      name,
      icon: icon || '📁',
      color: color || '#6366f1',
      type
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      error: 'Failed to create category',
      details: error.message
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { type } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const filters = {};
    if (type) {
      filters.type = type;
    }

    const categories = await Category.findByUserId(userId, filters);

    res.json({
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      details: error.message
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    // Check if category belongs to user
    if (category.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json({
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      error: 'Failed to get category',
      details: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;
    const { name, icon, color, type } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if category exists and belongs to user
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    if (existingCategory.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (icon) updateData.icon = icon;
    if (color) updateData.color = color;
    if (type) updateData.type = type;

    const category = await Category.update(id, updateData);

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      error: 'Failed to update category',
      details: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Check if category exists and belongs to user
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found'
      });
    }

    if (existingCategory.user_id !== userId) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await Category.delete(id);

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      details: error.message
    });
  }
};

export const getDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = Category.getDefaultCategories();
    
    res.json({
      categories: defaultCategories
    });
  } catch (error) {
    console.error('Get default categories error:', error);
    res.status(500).json({
      error: 'Failed to get default categories',
      details: error.message
    });
  }
}; 