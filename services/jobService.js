const Job = require('../models/Job');
const categoryService = require('./categoryService');

class JobService {
  async getAllJobs(filters = {}) {
    return await Job.find(filters)
      .populate('category', 'name icon color')
      .sort({ createdAt: -1 });
  }

  async getJobById(id) {
    return await Job.findById(id).populate('category', 'name icon color');
  }

  async createJob(jobData) {
    const job = new Job(jobData);
    await job.save();
    await categoryService.incrementJobCount(jobData.category);
    return await job.populate('category', 'name icon color');
  }

  async updateJob(id, jobData) {
    const job = await Job.findById(id);
    if (job.category.toString() !== jobData.category) {
      await categoryService.decrementJobCount(job.category);
      await categoryService.incrementJobCount(jobData.category);
    }
    return await Job.findByIdAndUpdate(id, jobData, {
      new: true,
      runValidators: true
    }).populate('category', 'name icon color');
  }

  async deleteJob(id) {
    const job = await Job.findById(id);
    await categoryService.decrementJobCount(job.category);
    await Job.findByIdAndDelete(id);
    return true;
  }

  async searchJobs(query) {
    return await Job.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    }).populate('category', 'name icon color')
      .sort({ createdAt: -1 });
  }

  async getJobsByCategory(categoryId) {
    return await Job.find({ category: categoryId })
      .populate('category', 'name icon color')
      .sort({ createdAt: -1 });
  }

  async getFeaturedJobs() {
    return await Job.find({ featured: true })
      .populate('category', 'name icon color')
      .sort({ createdAt: -1 })
      .limit(5);
  }

  async getRecentJobs() {
    return await Job.find()
      .populate('category', 'name icon color')
      .sort({ createdAt: -1 })
      .limit(10);
  }
}

module.exports = new JobService();