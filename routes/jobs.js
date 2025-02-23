const express = require('express');
const router = express.Router();
const {
  validateJob,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJobs // Import the searchJobs method
} = require('../controllers/jobController');

// Routes
router.get('/', getAllJobs);
router.get('/search', searchJobs); // New route for job search with related keyword suggestions
router.get('/:id', getJobById);
router.post('/', validateJob, createJob);
router.put('/:id', validateJob, updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
