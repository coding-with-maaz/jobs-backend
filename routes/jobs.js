const express = require('express');
const router = express.Router();
const {
  validateJob,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

// Routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', validateJob, createJob);
router.put('/:id', validateJob, updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
