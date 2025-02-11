const ProfileService = require('../services/profile.service');
const catchAsync = require('../utils/catchAsync');
const { validateImageUrl } = require('../utils/security.utils');
const AppError = require('../utils/appError');

exports.getProfile = catchAsync(async (req, res) => {
  const profile = await ProfileService.getProfile(
    req.params.userId || req.user.id,
    req.user.id
  );
  res.json({
    status: 'success',
    data: profile
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  // Validate image URLs if provided
  if (req.body.profileImage && !validateImageUrl(req.body.profileImage)) {
    throw new AppError('Invalid profile image URL', 400);
  }
  if (req.body.coverImage && !validateImageUrl(req.body.coverImage)) {
    throw new AppError('Invalid cover image URL', 400);
  }

  const profile = await ProfileService.updateProfile(req.user.id, req.body);
  res.json({
    status: 'success',
    data: profile
  });
});

exports.searchProfiles = catchAsync(async (req, res) => {
  const profiles = await ProfileService.searchProfiles(req.query);
  res.json({
    status: 'success',
    results: profiles.length,
    data: profiles
  });
});

exports.updateProfileStatus = catchAsync(async (req, res) => {
  const profile = await ProfileService.updateProfileStatus(
    req.params.userId,
    req.body.status
  );
  res.json({
    status: 'success',
    data: profile
  });
});