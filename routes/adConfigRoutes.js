// routes/adConfigRoutes.js
const express = require('express');
const router = express.Router();
const adConfigController = require('../controllers/AdConfigController');

router.get('/', adConfigController.getAdConfig);
router.put('/', adConfigController.updateAdConfig);

module.exports = router;
