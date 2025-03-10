const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { adminAuth } = require('../middleware/auth');

// All dashboard routes require admin authentication
router.use(adminAuth);

// Overall statistics
router.get('/stats', dashboardController.getOverallStats);

// User statistics
router.get('/users/stats', dashboardController.getUserStats);

// Job statistics
router.get('/jobs/stats', dashboardController.getJobStats);

// Category statistics
router.get('/categories/stats', dashboardController.getCategoryStats);

// Recent activities
router.get('/recent-activities', dashboardController.getRecentActivities);

// Monthly statistics
router.get('/monthly-stats', dashboardController.getMonthlyStats);

module.exports = router;