"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monthlyExecutionController_1 = require("../controllers/monthlyExecutionController");
const router = (0, express_1.Router)();
router.post('/', monthlyExecutionController_1.createMonthlyExecution);
router.get('/', monthlyExecutionController_1.getMonthlyExecutions);
router.put('/:id', monthlyExecutionController_1.updateMonthlyExecution);
router.delete('/:id', monthlyExecutionController_1.deleteMonthlyExecution);
// 批量操作
router.post('/batch', monthlyExecutionController_1.createBatchMonthlyExecutions);
// 获取项目年度计划
router.get('/project/:projectId/year/:year', monthlyExecutionController_1.getProjectYearlyPlan);
exports.default = router;
//# sourceMappingURL=monthlyExecutions.js.map