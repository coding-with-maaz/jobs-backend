const categoryService = require('../services/categoryService');
const { validationResult } = require('express-validator');
const Category = require('../models/Category');
const Job = require('../models/Job');

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.find()
        .select('_id name icon description color status')
        .lean();
      
      // Add job count for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const count = await Job.countDocuments({ category: category._id });
          return {
            ...category,
            jobCount: count
          };
        })
      );

      res.json(categoriesWithCount);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
