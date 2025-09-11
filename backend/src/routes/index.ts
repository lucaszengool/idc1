import express from 'express';
import projectRoutes from './projects';
import executionRoutes from './executions';
import statisticsRoutes from './statistics';
import adjustmentRoutes from './adjustments';

const router = express.Router();

router.use('/projects', projectRoutes);
router.use('/executions', executionRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/adjustments', adjustmentRoutes);

export default router;