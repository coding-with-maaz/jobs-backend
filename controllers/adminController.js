const adminService = require('../services/adminService');
const { validationResult } = require('express-validator');

class AdminController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, adminCode } = req.body;
      const admin = await adminService.register({ name, email, password, adminCode });
      res.status(201).json(admin);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const admin = await adminService.getProfile(req.user._id);
      res.json(admin);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const admin = await adminService.updateProfile(req.user._id, req.body);
      res.json(admin);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AdminController();