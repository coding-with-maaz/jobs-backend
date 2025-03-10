// models/AdConfig.js
const mongoose = require('mongoose');

const adConfigSchema = new mongoose.Schema({
  showAds: {
    type: Boolean,
    default: false,
  },
  bannerAdUnitId: {
    type: String,
    default: 'ca-app-pub-3940256099942544/6300978111', // Default test ID
  },
  interstitialAdUnitId: {
    type: String,
    default: 'ca-app-pub-3940256099942544/1033173712', // Default test ID
  },
});

module.exports = mongoose.model('AdConfig', adConfigSchema);
