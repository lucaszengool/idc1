import express from 'express';
import {
  submitForApproval,
  getPendingApprovals,
  reviewApproval,
  getApprovalHistory
} from '../controllers/approvalController';

const router = express.Router();

router.post('/submit', submitForApproval);
router.get('/pending/:approverId', getPendingApprovals);
router.post('/review/:approvalId', reviewApproval);
router.get('/history', getApprovalHistory);

export default router;