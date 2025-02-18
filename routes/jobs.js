// routes/jobs.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const adConfigController = require('../controllers/adConfigController');

// Job-related routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

// Ad configuration routes
router.get('/adConfig', adConfigController.getAdConfig);
router.put('/adConfig', adConfigController.updateAdConfig);

module.exports = router;
