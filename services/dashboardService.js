const User = require('../models/User');
const Job = require('../models/Job');
const Category = require('../models/Category');

class DashboardService {
  async getOverallStats() {
    const [
      totalUsers,
      totalJobs,
      totalCategories,
      activeJobs,
      completedRegistrations
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Category.countDocuments(),
      Job.countDocuments({ date: { $gte: new Date() } }),
      User.countDocuments({ registrationComplete: true })
    ]);

    return {
      totalUsers,
      totalJobs,
      totalCategories,
      activeJobs,
      completedRegistrations,
      registrationRate: ((completedRegistrations / totalUsers) * 100).toFixed(2)
    };
  }

  async getUserStats() {
    const [
      totalUsers,
      usersThisMonth,
      usersByRole,
      registrationProgress
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(1)) // First day of current month
        }
      }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        {
          $group: {
            _id: '$registrationStep',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      totalUsers,
      usersThisMonth,
      usersByRole: usersByRole.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      registrationProgress: registrationProgress.reduce((acc, { _id, count }) => {
        acc[`step${_id}`] = count;
        return acc;
      }, {})
    };
  }

  async getJobStats() {
    const [
      totalJobs,
      jobsByType,
      jobsByLocation,
      recentJobs,
      jobTrends
    ] = await Promise.all([
      Job.countDocuments(),
      Job.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Job.aggregate([
        { $group: { _id: '$location', count: { $sum: 1 } } }
      ]),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('category', 'name icon color'),
      Job.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    return {
      totalJobs,
      jobsByType: jobsByType.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      jobsByLocation: jobsByLocation.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      recentJobs,
      jobTrends
    };
  }

  async getCategoryStats() {
    const [
      totalCategories,
      categoriesWithJobs,
      topCategories
    ] = await Promise.all([
      Category.countDocuments(),
      Category.aggregate([
        {
          $lookup: {
            from: 'jobs',
            localField: '_id',
            foreignField: 'category',
            as: 'jobs'
          }
        },
        {
          $project: {
            name: 1,
            jobCount: { $size: '$jobs' }
          }
        }
      ]),
      Job.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        }
      ])
    ]);

    return {
      totalCategories,
      categoriesWithJobs,
      topCategories: topCategories.map(({ category, count }) => ({
        name: category.name,
        count,
        icon: category.icon,
        color: category.color
      }))
    };
  }

  async getRecentActivities() {
    const [recentUsers, recentJobs] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt'),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('category', 'name')
        .select('title company createdAt')
    ]);

    return {
      recentUsers,
      recentJobs
    };
  }

  async getMonthlyStats(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const [monthlyUsers, monthlyJobs] = await Promise.all([
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),
      Job.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
    ]);

    return {
      monthlyUsers: this._normalizeMonthlyData(monthlyUsers),
      monthlyJobs: this._normalizeMonthlyData(monthlyJobs)
    };
  }

  _normalizeMonthlyData(data) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthlyData = new Array(12).fill(0);

    data.forEach(({ _id, count }) => {
      monthlyData[_id - 1] = count;
    });

    return months.map((month, index) => ({
      month,
      count: monthlyData[index]
    }));
  }
}

module.exports = new DashboardService();