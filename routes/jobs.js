const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const jobController = require('../controllers/jobController');

// Validation middleware
const validateJob = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('category_id').notEmpty().withMessage('Category is required'),
  body('salary').notEmpty().trim().withMessage('Salary is required'),
  body('date').notEmpty().isDate().withMessage('Valid date is required'),
  body('company').notEmpty().trim().withMessage('Company is required'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('type').isIn(['Full Time', 'Part Time', 'Contract', 'Freelance']).withMessage('Invalid job type'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('requirements').isArray().withMessage('Requirements must be an array'),
  body('application_url').notEmpty().trim().isURL().withMessage('Valid application URL is required')
];

// Routes
router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJobById);
router.post('/', validateJob, jobController.createJob);
router.put('/:id', validateJob, jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;