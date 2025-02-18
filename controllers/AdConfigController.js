// controllers/AdConfigController.js
const AdConfig = require('../models/AdConfig');

class AdConfigController {
  async getAdConfig(req, res) {
    try {
      const adConfig = await AdConfig.findOne();
      if (!adConfig) {
        // Create a default configuration if none exists
        const defaultConfig = new AdConfig();
        await defaultConfig.save();
        return res.json(defaultConfig);
      }
      res.json(adConfig);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateAdConfig(req, res) {
    try {
      const { showAds, bannerAdUnitId, interstitialAdUnitId } = req.body;
      const adConfig = await AdConfig.findOneAndUpdate(
        {},
        { showAds, bannerAdUnitId, interstitialAdUnitId },
        { new: true, upsert: true }
      );
      res.json(adConfig);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AdConfigController();
