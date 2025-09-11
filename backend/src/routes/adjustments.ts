import express from 'express';
import {
  createAdjustment,
  getAdjustments,
} from '../controllers/adjustmentController';

const router = express.Router();

router.post('/', createAdjustment);
router.get('/', getAdjustments);

export default router;