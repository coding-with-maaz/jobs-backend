const Category = require('../models/Category');

class CategoryService {
  async getAllCategories() {
    return await Category.find().sort({ name: 1 });
  }

  async getCategoryById(id) {
    return await Category.findById(id);
  }

  async createCategory(categoryData) {
    const category = new Category(categoryData);
    return await category.save();
  }

  async updateCategory(id, categoryData) {
    return await Category.findByIdAndUpdate(
      id,
      categoryData,
      { new: true, runValidators: true }
    );
  }

  async deleteCategory(id) {
    await Category.findByIdAndDelete(id);
    return true;
  }

  async incrementJobCount(id) {
    return await Category.findByIdAndUpdate(
      id,
      { $inc: { count: 1 } },
      { new: true }
    );
  }

  async decrementJobCount(id) {
    return await Category.findByIdAndUpdate(
      id,
      { $inc: { count: -1 } },
      { new: true }
    );
  }
}

module.exports = new CategoryService();