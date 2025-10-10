"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const createProject = async (req, res) => {
    try {
        console.log('Create project request body:', req.body);
        console.log('User from request:', req.user);
        const { projectCode, projectName, projectType, projectStatus, owner, members, projectGoal, projectBackground, projectExplanation, procurementCode, completionStatus, relatedBudgetProject, budgetYear, budgetOccupied, orderAmount, acceptanceAmount, contractOrderNumber, expectedAcceptanceTime, 
        // 向后兼容字段
        category, subProjectName, budgetAmount, content, } = req.body;
        // 生成项目编号（如果没有提供）
        const finalProjectCode = projectCode || `DCOPS-${Date.now()}`;
        const finalProjectName = projectName || subProjectName;
        const finalBudgetAmount = parseFloat(budgetOccupied || budgetAmount || 0);
        console.log('Final project data to create:', {
            finalProjectCode,
            finalProjectName,
            finalBudgetAmount,
            category: category || 'IDC-架构研发',
            owner,
            content: content || '项目描述'
        });
        // 确保所有必填字段都有值
        const projectData = {
            projectCode: finalProjectCode,
            projectName: finalProjectName,
            projectType: projectType || '常规',
            projectStatus: projectStatus || '待开始',
            owner: owner || '待指定',
            members: members || '',
            projectGoal: projectGoal || content || '待完善项目目标',
            projectBackground: projectBackground || content || '待完善项目背景',
            projectExplanation: projectExplanation || content || '待完善推导说明',
            procurementCode: procurementCode || finalProjectCode,
            completionStatus: completionStatus || '未结项',
            relatedBudgetProject: relatedBudgetProject || finalProjectName,
            budgetYear: (budgetYear || new Date().getFullYear()).toString(),
            budgetOccupied: finalBudgetAmount,
            budgetExecuted: 0, // 初始执行金额为0
            remainingBudget: finalBudgetAmount, // 初始剩余 = 预算占用
            orderAmount: parseFloat(orderAmount || '0'),
            acceptanceAmount: parseFloat(acceptanceAmount || '0'),
            contractOrderNumber: contractOrderNumber || '',
            expectedAcceptanceTime: expectedAcceptanceTime ? new Date(expectedAcceptanceTime) : undefined,
            approvalStatus: 'draft', // 默认为草稿状态
            // 向后兼容字段
            category: category || 'IDC-架构研发',
            subProjectName: subProjectName || finalProjectName,
            budgetAmount: finalBudgetAmount, // 向后兼容
            content: content || projectBackground || '项目描述',
        };
        console.log('Final project data to create (detailed):', projectData);
        const project = await models_1.Project.create(projectData);
        console.log('Project created successfully:', project.toJSON());
        res.status(201).json({ success: true, data: project });
    }
    catch (error) {
        console.error('Create project error:', error);
        console.error('Error details:', error);
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
                    required: false,
                },
            ],
        });
        // 更新每个项目的budgetExecuted字段
        for (const project of rows) {
            const executions = project.get('executions');
            const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
            // 更新项目的budgetExecuted字段
            await project.update({ budgetExecuted: totalExecuted });
        }
        const projectsWithStats = rows.map(project => {
            const executions = project.get('executions');
            const budgetOccupied = parseFloat(project.budgetOccupied.toString());
            const budgetExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
            const remainingBudget = budgetOccupied - budgetExecuted;
            const executionRate = budgetOccupied > 0
                ? (budgetExecuted / budgetOccupied) * 100
                : 0;
            return {
                ...project.toJSON(),
                budgetExecuted,
                remainingBudget,
                executionRate: parseFloat(executionRate.toFixed(2)),
                // 向后兼容
                executedAmount: budgetExecuted,
                remainingAmount: remainingBudget,
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
                    required: false,
                },
            ],
        });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        const executions = project.get('executions');
        const budgetOccupied = parseFloat(project.budgetOccupied.toString());
        const budgetExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
        const remainingBudget = budgetOccupied - budgetExecuted;
        const executionRate = budgetOccupied > 0
            ? (budgetExecuted / budgetOccupied) * 100
            : 0;
        // 更新项目的budgetExecuted字段
        await project.update({ budgetExecuted });
        res.json({
            success: true,
            data: {
                ...project.toJSON(),
                budgetExecuted,
                remainingBudget,
                executionRate: parseFloat(executionRate.toFixed(2)),
                // 向后兼容
                executedAmount: budgetExecuted,
                remainingAmount: remainingBudget,
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
        const { category, projectName, subProjectName, owner, budgetAmount, content, 
        // 新字段支持
        budgetOccupied, projectBackground, projectGoal, projectExplanation, projectType, projectStatus, members, procurementCode, completionStatus, relatedBudgetProject, budgetYear, orderAmount, acceptanceAmount, contractOrderNumber, expectedAcceptanceTime } = req.body;
        const project = await models_1.Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        // 确定最终预算金额
        const finalBudgetAmount = parseFloat(budgetOccupied || budgetAmount || project.budgetOccupied);
        // 计算新的剩余预算 (原剩余预算 + 预算差额)
        const budgetDifference = finalBudgetAmount - parseFloat(project.budgetOccupied.toString());
        const newRemainingBudget = parseFloat(project.remainingBudget.toString()) + budgetDifference;
        const updateData = {
            category,
            projectName,
            subProjectName,
            owner,
            budgetAmount: finalBudgetAmount, // 向后兼容
            budgetOccupied: finalBudgetAmount, // 新字段
            remainingBudget: newRemainingBudget, // 更新剩余预算
            content: content || projectBackground || project.projectBackground,
            projectBackground: projectBackground || content || project.projectBackground,
            projectGoal: projectGoal || project.projectGoal,
            projectExplanation: projectExplanation || project.projectExplanation,
        };
        // 只更新提供的字段
        if (projectType !== undefined)
            updateData.projectType = projectType;
        if (projectStatus !== undefined)
            updateData.projectStatus = projectStatus;
        if (members !== undefined)
            updateData.members = members;
        if (procurementCode !== undefined)
            updateData.procurementCode = procurementCode;
        if (completionStatus !== undefined)
            updateData.completionStatus = completionStatus;
        if (relatedBudgetProject !== undefined)
            updateData.relatedBudgetProject = relatedBudgetProject;
        if (budgetYear !== undefined)
            updateData.budgetYear = budgetYear;
        if (orderAmount !== undefined)
            updateData.orderAmount = parseFloat(orderAmount);
        if (acceptanceAmount !== undefined)
            updateData.acceptanceAmount = parseFloat(acceptanceAmount);
        if (contractOrderNumber !== undefined)
            updateData.contractOrderNumber = contractOrderNumber;
        if (expectedAcceptanceTime !== undefined)
            updateData.expectedAcceptanceTime = new Date(expectedAcceptanceTime);
        await project.update(updateData);
        // 重新计算执行率等统计信息
        const executions = await models_1.BudgetExecution.findAll({ where: { projectId: id } });
        const budgetExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
        const executionRate = finalBudgetAmount > 0 ? (budgetExecuted / finalBudgetAmount) * 100 : 0;
        // 更新执行相关字段
        await project.update({
            budgetExecuted,
            remainingBudget: finalBudgetAmount - budgetExecuted
        });
        // 返回更新后的数据
        const updatedProject = await models_1.Project.findByPk(id);
        res.json({
            success: true,
            data: {
                ...updatedProject?.toJSON(),
                executionRate: parseFloat(executionRate.toFixed(2)),
                executedAmount: budgetExecuted, // 向后兼容
                remainingAmount: finalBudgetAmount - budgetExecuted, // 向后兼容
            }
        });
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
        // Delete all related records in order
        // 1. Delete budget executions
        await models_1.BudgetExecution.destroy({ where: { projectId: id } });
        // 2. Delete monthly execution plans
        await models_1.MonthlyExecution.destroy({ where: { projectId: id } });
        // 3. Delete budget adjustments where this project is the original project
        await models_1.BudgetAdjustment.destroy({ where: { originalProjectId: id } });
        // 4. Delete project transfers
        await models_1.ProjectTransfer.destroy({ where: { projectId: id } });
        // 5. Finally delete the project itself
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