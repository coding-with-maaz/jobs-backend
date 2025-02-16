const jobService = require('../services/jobService');
const { validationResult, body } = require('express-validator');
const Job = require('../models/Job');

class JobController {
  async getAllJobs(req, res) {
    try {
      const jobs = await jobService.getAllJobs();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getJobById(req, res) {
    try {
      const job = await jobService.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createJob(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const jobData = {
        ...req.body,
        date: new Date(), // Add current date
      };

      const job = new Job(jobData);
      await job.save();

      res.status(201).json(job);
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'Error creating job', error: error.message });
    }
  }

  async updateJob(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await jobService.updateJob(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteJob(req, res) {
    try {
      await jobService.deleteJob(req.params.id);
      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async searchJobs(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const jobs = await jobService.searchJobs(query);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// Validation middleware
const validateJob = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('category').trim().notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('salary').trim().notEmpty().withMessage('Salary is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').trim().notEmpty().withMessage('Job type is required')
    .isIn(['fulltime', 'parttime', 'contract', 'internship'])
    .withMessage('Invalid job type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('applicationUrl').trim().notEmpty().withMessage('Application URL is required')
    .isURL().withMessage('Valid application URL is required'),
  body('requirements').isArray().withMessage('Requirements must be an array'),
];

module.exports = {
  validateJob,
  getAllJobs: JobController.prototype.getAllJobs,
  getJobById: JobController.prototype.getJobById,
  createJob: JobController.prototype.createJob,
  updateJob: JobController.prototype.updateJob,
  deleteJob: JobController.prototype.deleteJob,
  searchJobs: JobController.prototype.searchJobs
};
