import express from 'express';
import {
  createOrUpdateTotalBudget,
  getTotalBudget,
  getAllTotalBudgets,
  deleteTotalBudget,
} from '../controllers/totalBudgetController';

const router = express.Router();

router.post('/', createOrUpdateTotalBudget);
router.get('/', getAllTotalBudgets);
router.get('/:year', getTotalBudget);
router.delete('/:id', deleteTotalBudget);

export default router;