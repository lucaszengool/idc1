"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTotalBudget = exports.getAllTotalBudgets = exports.getTotalBudget = exports.createOrUpdateTotalBudget = void 0;
const models_1 = require("../models");
const createOrUpdateTotalBudget = async (req, res) => {
    try {
        const { budgetYear, totalAmount, description = '', createdBy = 'Admin' } = req.body;
        // Check if total budget for this year already exists
        let totalBudget = await models_1.TotalBudget.findOne({ where: { budgetYear } });
        if (totalBudget) {
            // Update existing total budget
            await totalBudget.update({
                totalAmount: parseFloat(totalAmount),
                description,
                createdBy,
            });
        }
        else {
            // Create new total budget
            totalBudget = await models_1.TotalBudget.create({
                budgetYear,
                totalAmount: parseFloat(totalAmount),
                description,
                createdBy,
            });
        }
        res.status(200).json({ success: true, data: totalBudget });
    }
    catch (error) {
        console.error('Create/Update total budget error:', error);
        res.status(500).json({ success: false, message: 'Failed to create/update total budget' });
    }
};
exports.createOrUpdateTotalBudget = createOrUpdateTotalBudget;
const getTotalBudget = async (req, res) => {
    try {
        const { year } = req.params;
        const totalBudget = await models_1.TotalBudget.findOne({
            where: { budgetYear: year }
        });
        if (!totalBudget) {
            return res.status(404).json({
                success: false,
                message: 'Total budget not found for this year'
            });
        }
        // Calculate allocated budget (sum of all project budgets)
        const projects = await models_1.Project.findAll({
            where: { budgetYear: year },
        });
        const allocatedBudget = projects.reduce((sum, project) => {
            return sum + parseFloat(project.budgetOccupied.toString());
        }, 0);
        const availableBudget = parseFloat(totalBudget.totalAmount.toString()) - allocatedBudget;
        const result = {
            ...totalBudget.toJSON(),
            allocatedBudget,
            availableBudget,
            projectCount: projects.length,
        };
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Get total budget error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch total budget' });
    }
};
exports.getTotalBudget = getTotalBudget;
const getAllTotalBudgets = async (req, res) => {
    try {
        const totalBudgets = await models_1.TotalBudget.findAll({
            order: [['budgetYear', 'DESC']],
        });
        // For each budget, calculate allocated and available amounts
        const budgetsWithStats = await Promise.all(totalBudgets.map(async (budget) => {
            const projects = await models_1.Project.findAll({
                where: { budgetYear: budget.budgetYear },
            });
            const allocatedBudget = projects.reduce((sum, project) => {
                return sum + parseFloat(project.budgetOccupied.toString());
            }, 0);
            const availableBudget = parseFloat(budget.totalAmount.toString()) - allocatedBudget;
            return {
                ...budget.toJSON(),
                allocatedBudget,
                availableBudget,
                projectCount: projects.length,
            };
        }));
        res.json({ success: true, data: budgetsWithStats });
    }
    catch (error) {
        console.error('Get all total budgets error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch total budgets' });
    }
};
exports.getAllTotalBudgets = getAllTotalBudgets;
const deleteTotalBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const totalBudget = await models_1.TotalBudget.findByPk(id);
        if (!totalBudget) {
            return res.status(404).json({ success: false, message: 'Total budget not found' });
        }
        await totalBudget.destroy();
        res.json({ success: true, message: 'Total budget deleted successfully' });
    }
    catch (error) {
        console.error('Delete total budget error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete total budget' });
    }
};
exports.deleteTotalBudget = deleteTotalBudget;
//# sourceMappingURL=totalBudgetController.js.map