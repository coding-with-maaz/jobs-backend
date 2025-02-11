const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await userService.getProfile(req.user._id);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const profile = await userService.updateProfile(req.user._id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async saveJob(req, res) {
    try {
      const savedJobs = await userService.saveJob(req.user._id, req.params.jobId);
      res.json(savedJobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async unsaveJob(req, res) {
    try {
      const savedJobs = await userService.unsaveJob(req.user._id, req.params.jobId);
      res.json(savedJobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();