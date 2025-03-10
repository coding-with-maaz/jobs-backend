const dashboardService = require('../services/dashboardService');

class DashboardController {
  constructor() {
    // Bind all methods to ensure proper 'this' context
    this.getOverallStats = this.getOverallStats.bind(this);
    this.getUserStats = this.getUserStats.bind(this);
    this.getJobStats = this.getJobStats.bind(this);
    this.getCategoryStats = this.getCategoryStats.bind(this);
    this.getRecentActivities = this.getRecentActivities.bind(this);
    this.getMonthlyStats = this.getMonthlyStats.bind(this);
  }

  async getOverallStats(req, res) {
    try {
      const stats = await dashboardService.getOverallStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserStats(req, res) {
    try {
      const stats = await dashboardService.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getJobStats(req, res) {
    try {
      const stats = await dashboardService.getJobStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryStats(req, res) {
    try {
      const stats = await dashboardService.getCategoryStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRecentActivities(req, res) {
    try {
      const activities = await dashboardService.getRecentActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMonthlyStats(req, res) {
    try {
      const { year = new Date().getFullYear() } = req.query;
      const stats = await dashboardService.getMonthlyStats(parseInt(year));
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// Create and export a single instance
const dashboardController = new DashboardController();
module.exports = dashboardController;