"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projects_1 = __importDefault(require("./projects"));
const executions_1 = __importDefault(require("./executions"));
const statistics_1 = __importDefault(require("./statistics"));
const adjustments_1 = __importDefault(require("./adjustments"));
const monthlyExecutions_1 = __importDefault(require("./monthlyExecutions"));
const totalBudget_1 = __importDefault(require("./totalBudget"));
const auth_1 = __importDefault(require("./auth"));
const groups_1 = __importDefault(require("./groups"));
const approvals_1 = __importDefault(require("./approvals"));
// import projectTransferRoutes from './projectTransfers';
const router = express_1.default.Router();
// 认证路由
router.use('/auth', auth_1.default);
// 组管理路由
router.use('/groups', groups_1.default);
// 审核工作流路由
router.use('/approvals', approvals_1.default);
// 项目转移路由 - 已删除
// router.use('/project-transfers', projectTransferRoutes);
// 现有路由
router.use('/projects', projects_1.default);
router.use('/executions', executions_1.default);
router.use('/statistics', statistics_1.default);
router.use('/adjustments', adjustments_1.default);
router.use('/monthly-executions', monthlyExecutions_1.default);
router.use('/total-budget', totalBudget_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map