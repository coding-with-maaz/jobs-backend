require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Job = require('../models/Job');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Job.deleteMany({});

    // Seed categories
    const categories = await Category.create([
      {
        name: 'General Jobs',
        icon: 'briefcase-outline',
        count: 156,
        color: '#007E23'
      },
      {
        name: 'Technology',
        icon: 'computer-outline',
        count: 78,
        color: '#0052CC'
      },
      {
        name: 'Healthcare',
        icon: 'medical-outline',
        count: 92,
        color: '#DE350B'
      }
    ]);

    // Seed jobs
    const jobs = await Job.create([
      {
        title: "Kitchen Helper",
        category: categories[0]._id,
        salary: "Up to KWD 350.00 per month",
        date: "2024-12-08",
        company: "Al-Kuwait Restaurant",
        location: "Kuwait City",
        type: "Full Time",
        description: "We are looking for an experienced Kitchen Helper to join our team...",
        requirements: [
          "Minimum 2 years experience in similar role",
          "Good communication skills",
          "Ability to work in shifts",
          "Knowledge of food safety standards"
        ],
        applicationUrl: 'https://alkuwaitrestaurant.com/careers/kitchen-helper'
      }
    ]);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();