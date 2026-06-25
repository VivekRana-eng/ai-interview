const express = require('express');
const router = express.Router();
const { getKPIs, getRecruitmentOverview, getFunnelMetrics } = require('../controllers/analyticsController');

router.get('/kpis', getKPIs);
router.get('/overview', getRecruitmentOverview);
router.get('/funnel', getFunnelMetrics);

module.exports = router;
