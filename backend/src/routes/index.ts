import express from 'express';
import projectRoutes from './projects';
import executionRoutes from './executions';
import statisticsRoutes from './statistics';
import adjustmentRoutes from './adjustments';
import monthlyExecutionRoutes from './monthlyExecutions';
import totalBudgetRoutes from './totalBudget';
import authRoutes from './auth';
import groupRoutes from './groups';
import approvalRoutes from './approvals';
import budgetVersionRoutes from './budgetVersions';
import projectTransferRoutes from './projectTransfers';
import adminRoutes from './admin';

const router = express.Router();

// 认证路由
router.use('/auth', authRoutes);

// 组管理路由
router.use('/groups', groupRoutes);

// 审核工作流路由
router.use('/approvals', approvalRoutes);

// 预算版本路由
router.use('/budget-versions', budgetVersionRoutes);

// 项目转移路由
router.use('/project-transfers', projectTransferRoutes);

// 现有路由
router.use('/projects', projectRoutes);
router.use('/executions', executionRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/adjustments', adjustmentRoutes);
router.use('/monthly-executions', monthlyExecutionRoutes);
router.use('/total-budget', totalBudgetRoutes);

// 管理员路由
router.use('/admin', adminRoutes);

export default router;