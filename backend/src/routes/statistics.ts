import express from 'express';
import {
  getDashboard,
  getStatisticsByCategory,
  getStatisticsByOwner,
  getTotalStatistics,
} from '../controllers/statisticsController';

const router = express.Router();

router.get('/dashboard', getDashboard);
router.get('/by-category', getStatisticsByCategory);
router.get('/by-owner', getStatisticsByOwner);
router.get('/total', getTotalStatistics);

export default router;