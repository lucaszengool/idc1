"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalStatistics = exports.getStatisticsByOwner = exports.getStatisticsByCategory = exports.getDashboard = void 0;
const models_1 = require("../models");
const getDashboard = async (req, res) => {
    try {
        // Get year from query parameter, default to current year
        const budgetYear = req.query.year || new Date().getFullYear().toString();
        // Get total budget for the specified year
        const totalBudgetRecord = await models_1.TotalBudget.findOne({
            where: { budgetYear }
        });
        // Get all projects for the specified year with their executions
        const projects = await models_1.Project.findAll({
            where: {
                budgetYear: budgetYear
            },
            include: [{
                    model: models_1.BudgetExecution,
                    as: 'executions',
                    required: false // LEFT JOIN to include projects without executions
                }],
        });
        // Calculate statistics
        const totalBudgetAmount = totalBudgetRecord ? parseFloat(totalBudgetRecord.totalAmount.toString()) : 0;
        let allocatedBudget = 0;
        let totalExecuted = 0;
        let totalPredictedExecution = 0; // Add predicted execution total
        const categoryStats = [];
        const highRiskProjects = [];
        // 新增：预算分类统计
        let pendingBudget = 0; // 预提待使用预算（budgetExecuted = 0的项目）
        let completedBudget = 0; // 已完成验收预算
        const pendingProjects = []; // 预提待使用的项目列表
        const completedProjects = []; // 已完成验收的项目列表
        const categoryMap = new Map();
        projects.forEach((project) => {
            const budgetAmount = parseFloat(project.budgetOccupied || project.budgetAmount || 0);
            allocatedBudget += budgetAmount;
            // Use budgetExecuted field from project instead of calculating from executions
            const executedAmount = parseFloat(project.budgetExecuted || 0);
            totalExecuted += executedAmount;
            // Calculate predicted execution amount from project data
            // Use acceptanceAmount if > 0, otherwise orderAmount if > 0, otherwise budgetOccupied
            // Note: DECIMAL values from SQLite may be strings, so "0" is truthy - must parse first
            const acceptAmt = parseFloat(project.acceptanceAmount?.toString() || '0');
            const orderAmt = parseFloat(project.orderAmount?.toString() || '0');
            const predictedAmount = acceptAmt > 0 ? acceptAmt : (orderAmt > 0 ? orderAmt : budgetAmount);
            totalPredictedExecution += predictedAmount;
            const executionRate = budgetAmount > 0 ? (executedAmount / budgetAmount) * 100 : 0;
            // 判断项目是预提待使用还是已完成验收
            // 如果执行金额为0，则为预提待使用；否则按验收金额计入已完成验收
            if (executedAmount === 0 && budgetAmount > 0) {
                pendingBudget += budgetAmount;
                pendingProjects.push({
                    id: project.id,
                    projectName: project.projectName,
                    budgetAmount,
                    executedAmount: 0,
                    category: project.category || '未分类',
                });
            }
            else if (executedAmount > 0) {
                completedBudget += executedAmount;
                completedProjects.push({
                    id: project.id,
                    projectName: project.projectName,
                    budgetAmount,
                    executedAmount,
                    category: project.category || '未分类',
                });
            }
            // Track category stats with executed amounts from execution data and subprojects
            const category = project.category || project.projectType || '未分类';
            if (categoryMap.has(category)) {
                const cat = categoryMap.get(category);
                cat.totalBudget += budgetAmount;
                cat.executedAmount += executedAmount; // Track actual executed amounts
                cat.projectCount += 1;
                cat.projects.push({
                    id: project.id,
                    subProjectName: project.subProjectName || project.projectName,
                    projectName: project.projectName,
                    owner: project.owner,
                    budgetAmount,
                    executedAmount,
                });
            }
            else {
                categoryMap.set(category, {
                    category,
                    totalBudget: budgetAmount,
                    executedAmount, // Track actual executed amounts
                    projectCount: 1,
                    projects: [{
                            id: project.id,
                            subProjectName: project.subProjectName || project.projectName,
                            projectName: project.projectName,
                            owner: project.owner,
                            budgetAmount,
                            executedAmount,
                        }],
                });
            }
            // Check for high-risk projects (execution rate > 80%)
            if (executionRate > 80) {
                highRiskProjects.push({
                    id: project.id,
                    projectName: project.projectName,
                    budgetAmount,
                    executedAmount,
                    executionRate,
                });
            }
        });
        // Convert category map to array
        categoryMap.forEach((value) => {
            categoryStats.push(value);
        });
        // Get recent executions
        const recentExecutions = await models_1.BudgetExecution.findAll({
            include: [{
                    model: models_1.Project,
                    as: 'executionProject',
                    required: false
                }],
            order: [['createdAt', 'DESC']],
            limit: 5,
        });
        const availableBudget = totalBudgetAmount - allocatedBudget;
        const remainingBudget = totalBudgetAmount - totalExecuted; // Use total budget instead of allocated
        const executionRate = totalBudgetAmount > 0 ? (totalExecuted / totalBudgetAmount) * 100 : 0; // Calculate based on total budget
        const predictedRemainingBudget = totalBudgetAmount - totalPredictedExecution;
        // 计算剩余未使用预算（总预算 - 预提待使用 - 已完成验收）
        const unusedBudget = totalBudgetAmount - pendingBudget - completedBudget;
        res.json({
            success: true,
            data: {
                总预算: totalBudgetAmount,
                已分配预算: allocatedBudget,
                可支配预算: availableBudget,
                已执行金额: totalExecuted,
                剩余预算: remainingBudget,
                预算执行率: parseFloat(executionRate.toFixed(2)),
                预计执行金额: totalPredictedExecution,
                预计剩余预算: predictedRemainingBudget,
                项目总数: projects.length,
                categoryStats,
                recentExecutions,
                highRiskProjects,
                // 新增预算分类数据
                预提待使用预算: pendingBudget,
                已完成验收预算: completedBudget,
                剩余未使用预算: unusedBudget,
                预提待使用项目: pendingProjects,
                已完成验收项目: completedProjects,
            },
        });
    }
    catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
    }
};
exports.getDashboard = getDashboard;
const getStatisticsByCategory = async (req, res) => {
    try {
        res.json({ success: true, data: [] });
    }
    catch (error) {
        console.error('Get statistics by category error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch category statistics' });
    }
};
exports.getStatisticsByCategory = getStatisticsByCategory;
const getStatisticsByOwner = async (req, res) => {
    try {
        res.json({ success: true, data: [] });
    }
    catch (error) {
        console.error('Get statistics by owner error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch owner statistics' });
    }
};
exports.getStatisticsByOwner = getStatisticsByOwner;
const getTotalStatistics = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                summary: {},
                monthlyTrends: [],
            }
        });
    }
    catch (error) {
        console.error('Get total statistics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch total statistics' });
    }
};
exports.getTotalStatistics = getTotalStatistics;
//# sourceMappingURL=statisticsController.js.map