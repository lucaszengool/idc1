"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const createProject = async (req, res) => {
    try {
        const { category, projectName, subProjectName, owner, budgetAmount, content } = req.body;
        const project = await models_1.Project.create({
            category,
            projectName,
            subProjectName,
            owner,
            budgetAmount: parseFloat(budgetAmount),
            content,
        });
        res.status(201).json({ success: true, data: project });
    }
    catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ success: false, message: 'Failed to create project' });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const { category, owner, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const whereClause = {};
        if (category)
            whereClause.category = category;
        if (owner)
            whereClause.owner = { [sequelize_1.Op.iLike]: `%${owner}%` };
        const { count, rows } = await models_1.Project.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: models_1.BudgetExecution,
                    as: 'executions',
                    attributes: ['executionAmount'],
                },
            ],
        });
        const projectsWithStats = rows.map(project => {
            const executions = project.get('executions');
            const executedAmount = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
            const remainingAmount = parseFloat(project.budgetAmount.toString()) - executedAmount;
            const executionRate = parseFloat(project.budgetAmount.toString()) > 0
                ? (executedAmount / parseFloat(project.budgetAmount.toString())) * 100
                : 0;
            return {
                ...project.toJSON(),
                executedAmount,
                remainingAmount,
                executionRate: parseFloat(executionRate.toFixed(2)),
            };
        });
        res.json({
            success: true,
            data: {
                projects: projectsWithStats,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await models_1.Project.findByPk(id, {
            include: [
                {
                    model: models_1.BudgetExecution,
                    as: 'executions',
                    order: [['executionDate', 'DESC']],
                },
            ],
        });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        const executions = project.get('executions');
        const executedAmount = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
        const remainingAmount = parseFloat(project.budgetAmount.toString()) - executedAmount;
        const executionRate = parseFloat(project.budgetAmount.toString()) > 0
            ? (executedAmount / parseFloat(project.budgetAmount.toString())) * 100
            : 0;
        res.json({
            success: true,
            data: {
                ...project.toJSON(),
                executedAmount,
                remainingAmount,
                executionRate: parseFloat(executionRate.toFixed(2)),
            },
        });
    }
    catch (error) {
        console.error('Get project by ID error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch project' });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, projectName, subProjectName, owner, budgetAmount, content } = req.body;
        const project = await models_1.Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        await project.update({
            category,
            projectName,
            subProjectName,
            owner,
            budgetAmount: parseFloat(budgetAmount),
            content,
        });
        res.json({ success: true, data: project });
    }
    catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ success: false, message: 'Failed to update project' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await models_1.Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        await project.destroy();
        res.json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=projectController.js.map