"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalStatistics = exports.getStatisticsByOwner = exports.getStatisticsByCategory = exports.getDashboard = void 0;
const models_1 = require("../models");
const getDashboard = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear().toString();
        // Get total budget for current year
        const totalBudgetRecord = await models_1.TotalBudget.findOne({
            where: { budgetYear: currentYear }
        });
        // Get all projects with their executions
        const projects = await models_1.Project.findAll({
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
        const categoryMap = new Map();
        projects.forEach((project) => {
            const budgetAmount = parseFloat(project.budgetOccupied || project.budgetAmount || 0);
            allocatedBudget += budgetAmount;
            const executions = project.executions || [];
            const executedAmount = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount), 0);
            totalExecuted += executedAmount;
            // Calculate predicted execution amount from project data
            // Use acceptanceAmount if available, otherwise use orderAmount, otherwise use budgetOccupied
            const predictedAmount = parseFloat(project.acceptanceAmount || project.orderAmount || project.budgetOccupied || 0);
            totalPredictedExecution += predictedAmount;
            const executionRate = budgetAmount > 0 ? (executedAmount / budgetAmount) * 100 : 0;
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