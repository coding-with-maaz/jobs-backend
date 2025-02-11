const jobService = require('../services/jobService');
const { validationResult } = require('express-validator');

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

      const job = await jobService.createJob(req.body);
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ message: error.message });
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

module.exports = new JobController();