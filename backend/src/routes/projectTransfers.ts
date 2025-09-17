import express from 'express';
import {
  initiateProjectTransfer,
  getProjectTransfers,
  approveProjectTransfer,
  rejectProjectTransfer,
  getBudgetReallocationOptions
} from '../controllers/projectTransferController';

const router = express.Router();

router.post('/', initiateProjectTransfer);
router.get('/', getProjectTransfers);
router.post('/:transferId/approve', approveProjectTransfer);
router.post('/:transferId/reject', rejectProjectTransfer);
router.get('/reallocation-options', getBudgetReallocationOptions);

export default router;