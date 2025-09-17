"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectYearlyPlan = exports.createBatchMonthlyExecutions = exports.deleteMonthlyExecution = exports.updateMonthlyExecution = exports.getMonthlyExecutions = exports.createMonthlyExecution = void 0;
const models_1 = require("../models");
const createMonthlyExecution = async (req, res) => {
    try {
        const { projectId, year, month, planDescription, actualDescription, isCompleted = false, } = req.body;
        const monthlyExecution = await models_1.MonthlyExecution.create({
            projectId,
            year,
            month,
            planDescription,
            actualDescription: actualDescription || '',
            isCompleted,
        });
        res.status(201).json({ success: true, data: monthlyExecution });
    }
    catch (error) {
        console.error('Create monthly execution error:', error);
        res.status(500).json({ success: false, message: 'Failed to create monthly execution' });
    }
};
exports.createMonthlyExecution = createMonthlyExecution;
const getMonthlyExecutions = async (req, res) => {
    try {
        const { projectId, year, month } = req.query;
        const whereClause = {};
        if (projectId)
            whereClause.projectId = projectId;
        if (year)
            whereClause.year = year;
        if (month)
            whereClause.month = month;
        const monthlyExecutions = await models_1.MonthlyExecution.findAll({
            where: whereClause,
            include: [
                {
                    model: models_1.Project,
                    as: 'project',
                },
            ],
            order: [['year', 'DESC'], ['month', 'DESC']],
        });
        res.json({
            success: true,
            data: monthlyExecutions,
        });
    }
    catch (error) {
        console.error('Get monthly executions error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch monthly executions' });
    }
};
exports.getMonthlyExecutions = getMonthlyExecutions;
const updateMonthlyExecution = async (req, res) => {
    try {
        const { id } = req.params;
        const { planDescription, actualDescription, isCompleted, } = req.body;
        const monthlyExecution = await models_1.MonthlyExecution.findByPk(id);
        if (!monthlyExecution) {
            return res.status(404).json({ success: false, message: 'Monthly execution not found' });
        }
        await monthlyExecution.update({
            planDescription,
            actualDescription,
            isCompleted,
        });
        res.json({ success: true, data: monthlyExecution });
    }
    catch (error) {
        console.error('Update monthly execution error:', error);
        res.status(500).json({ success: false, message: 'Failed to update monthly execution' });
    }
};
exports.updateMonthlyExecution = updateMonthlyExecution;
const deleteMonthlyExecution = async (req, res) => {
    try {
        const { id } = req.params;
        const monthlyExecution = await models_1.MonthlyExecution.findByPk(id);
        if (!monthlyExecution) {
            return res.status(404).json({ success: false, message: 'Monthly execution not found' });
        }
        await monthlyExecution.destroy();
        res.json({ success: true, message: 'Monthly execution deleted successfully' });
    }
    catch (error) {
        console.error('Delete monthly execution error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete monthly execution' });
    }
};
exports.deleteMonthlyExecution = deleteMonthlyExecution;
// 批量创建项目的月度执行计划
const createBatchMonthlyExecutions = async (req, res) => {
    try {
        const { projectId, executions } = req.body;
        const createdExecutions = await models_1.MonthlyExecution.bulkCreate(executions.map((execution) => ({
            projectId,
            ...execution,
        })), {
            updateOnDuplicate: ['planDescription', 'actualDescription', 'isCompleted'],
        });
        res.status(201).json({ success: true, data: createdExecutions });
    }
    catch (error) {
        console.error('Create batch monthly executions error:', error);
        res.status(500).json({ success: false, message: 'Failed to create batch monthly executions' });
    }
};
exports.createBatchMonthlyExecutions = createBatchMonthlyExecutions;
// 获取项目的年度执行计划概览
const getProjectYearlyPlan = async (req, res) => {
    try {
        const { projectId, year } = req.params;
        const monthlyExecutions = await models_1.MonthlyExecution.findAll({
            where: {
                projectId,
                year,
            },
            order: [['month', 'ASC']],
        });
        // 创建12个月的数据结构
        const yearlyPlan = Array.from({ length: 12 }, (_, index) => {
            const month = index + 1;
            const execution = monthlyExecutions.find(me => me.month === month);
            return {
                month,
                planDescription: execution?.planDescription || '',
                actualDescription: execution?.actualDescription || '',
                isCompleted: execution?.isCompleted || false,
                id: execution?.id || null,
            };
        });
        res.json({
            success: true,
            data: {
                projectId,
                year,
                monthlyPlans: yearlyPlan,
            },
        });
    }
    catch (error) {
        console.error('Get project yearly plan error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch project yearly plan' });
    }
};
exports.getProjectYearlyPlan = getProjectYearlyPlan;
//# sourceMappingURL=monthlyExecutionController.js.map