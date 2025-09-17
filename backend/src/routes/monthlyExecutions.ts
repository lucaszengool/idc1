import { Router } from 'express';
import {
  createMonthlyExecution,
  getMonthlyExecutions,
  updateMonthlyExecution,
  deleteMonthlyExecution,
  createBatchMonthlyExecutions,
  getProjectYearlyPlan,
} from '../controllers/monthlyExecutionController';

const router = Router();

router.post('/', createMonthlyExecution);
router.get('/', getMonthlyExecutions);
router.put('/:id', updateMonthlyExecution);
router.delete('/:id', deleteMonthlyExecution);

// 批量操作
router.post('/batch', createBatchMonthlyExecutions);

// 获取项目年度计划
router.get('/project/:projectId/year/:year', getProjectYearlyPlan);

export default router;