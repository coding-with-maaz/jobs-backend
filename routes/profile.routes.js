const express = require('express');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema } = require('../validations/profile.validation');

const router = express.Router();

// Public routes
router.get('/search', profileController.searchProfiles);

// Protected routes
router.use(protect);

router.route('/me')
  .get(profileController.getProfile)
  .patch(validate(updateProfileSchema), profileController.updateProfile);

router.get('/:userId', profileController.getProfile);

// Admin only routes
router.use(restrictTo('ADMIN'));
router.patch('/:userId/status', profileController.updateProfileStatus);

module.exports = router;