"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdjustments = exports.createAdjustment = void 0;
const models_1 = require("../models");
const createAdjustment = async (req, res) => {
    try {
        const { originalProjectId, newProjectName, adjustmentReason, adjustmentAmount, targetCategory, targetProject, targetSubProject, targetOwner, } = req.body;
        // Check if original project exists and has enough remaining budget
        const originalProject = await models_1.Project.findByPk(originalProjectId, {
            include: [{ model: models_1.BudgetExecution, as: 'executions' }],
        });
        if (!originalProject) {
            return res.status(404).json({ success: false, message: 'Original project not found' });
        }
        const executions = originalProject.get('executions');
        const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
        const remainingBudget = parseFloat(originalProject.budgetAmount.toString()) - totalExecuted;
        if (parseFloat(adjustmentAmount) > remainingBudget) {
            return res.status(400).json({
                success: false,
                message: `Adjustment amount (${adjustmentAmount}) exceeds remaining budget (${remainingBudget.toFixed(2)})`
            });
        }
        const adjustment = await models_1.BudgetAdjustment.create({
            originalProjectId: parseInt(originalProjectId),
            newProjectName,
            adjustmentReason,
            adjustmentAmount: parseFloat(adjustmentAmount),
            targetCategory,
            targetProject,
            targetSubProject,
            targetOwner,
        });
        const adjustmentWithProject = await models_1.BudgetAdjustment.findByPk(adjustment.id, {
            include: [{ model: models_1.Project, as: 'originalProject' }],
        });
        res.status(201).json({ success: true, data: adjustmentWithProject });
    }
    catch (error) {
        console.error('Create adjustment error:', error);
        res.status(500).json({ success: false, message: 'Failed to create budget adjustment' });
    }
};
exports.createAdjustment = createAdjustment;
const getAdjustments = async (req, res) => {
    try {
        const { originalProjectId, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const whereClause = {};
        if (originalProjectId)
            whereClause.originalProjectId = originalProjectId;
        const { count, rows } = await models_1.BudgetAdjustment.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']],
            include: [{ model: models_1.Project, as: 'originalProject' }],
        });
        res.json({
            success: true,
            data: {
                adjustments: rows,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Get adjustments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch budget adjustments' });
    }
};
exports.getAdjustments = getAdjustments;
//# sourceMappingURL=adjustmentController.js.map