"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApprovalHistory = exports.reviewApproval = exports.getPendingApprovals = exports.submitForApproval = void 0;
const models_1 = require("../models");
const submitForApproval = async (req, res) => {
    try {
        const { requestType, requestData, requesterId, groupId } = req.body;
        if (!requestType || !requestData || !requesterId || !groupId) {
            return res.status(400).json({
                success: false,
                message: 'Request type, data, requester ID, and group ID are required'
            });
        }
        // 验证组是否存在并获取PM
        const group = await models_1.Group.findByPk(groupId, {
            include: [
                {
                    model: models_1.User,
                    as: 'pm',
                    attributes: ['id', 'username', 'displayName', 'role']
                }
            ]
        });
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        // 验证请求者是否在该组中
        const membership = await models_1.GroupMember.findOne({
            where: {
                groupId,
                userId: requesterId
            }
        });
        if (!membership && group.pmId !== parseInt(requesterId)) {
            return res.status(403).json({
                success: false,
                message: 'Only group members can submit requests'
            });
        }
        // PM不需要审核自己的请求
        if (group.pmId === parseInt(requesterId)) {
            // 直接执行操作
            const result = await executeApprovedRequest(requestType, requestData);
            return res.json({
                success: true,
                data: result,
                message: 'Request executed directly (PM authority)'
            });
        }
        // 创建审核请求
        const approval = await models_1.Approval.create({
            requestType,
            requestData,
            requesterId: parseInt(requesterId),
            approverId: group.pmId,
            groupId: parseInt(groupId),
            status: 'pending',
            submittedAt: new Date()
        });
        const approvalWithDetails = await models_1.Approval.findByPk(approval.id, {
            include: [
                {
                    model: models_1.User,
                    as: 'requester',
                    attributes: ['id', 'username', 'displayName']
                },
                {
                    model: models_1.User,
                    as: 'approver',
                    attributes: ['id', 'username', 'displayName']
                },
                {
                    model: models_1.Group,
                    as: 'group',
                    attributes: ['id', 'groupName']
                }
            ]
        });
        res.status(201).json({
            success: true,
            data: approvalWithDetails,
            message: 'Request submitted for approval'
        });
    }
    catch (error) {
        console.error('Submit for approval error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit request for approval'
        });
    }
};
exports.submitForApproval = submitForApproval;
const getPendingApprovals = async (req, res) => {
    try {
        const { approverId } = req.params;
        const approvals = await models_1.Approval.findAll({
            where: {
                approverId: parseInt(approverId),
                status: 'pending'
            },
            include: [
                {
                    model: models_1.User,
                    as: 'requester',
                    attributes: ['id', 'username', 'displayName', 'role']
                },
                {
                    model: models_1.Group,
                    as: 'group',
                    attributes: ['id', 'groupName']
                }
            ],
            order: [['submittedAt', 'ASC']]
        });
        res.json({
            success: true,
            data: approvals
        });
    }
    catch (error) {
        console.error('Get pending approvals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending approvals'
        });
    }
};
exports.getPendingApprovals = getPendingApprovals;
const reviewApproval = async (req, res) => {
    try {
        const { approvalId } = req.params;
        const { action, reviewNotes, approverId } = req.body;
        if (!action || !approverId) {
            return res.status(400).json({
                success: false,
                message: 'Action and approver ID are required'
            });
        }
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Action must be approve or reject'
            });
        }
        const approval = await models_1.Approval.findByPk(approvalId);
        if (!approval) {
            return res.status(404).json({
                success: false,
                message: 'Approval request not found'
            });
        }
        // 验证审核者权限
        if (approval.approverId !== parseInt(approverId)) {
            return res.status(403).json({
                success: false,
                message: 'Only assigned approver can review this request'
            });
        }
        if (approval.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Request has already been reviewed'
            });
        }
        // 更新审核状态
        await approval.update({
            status: action === 'approve' ? 'approved' : 'rejected',
            reviewNotes,
            reviewedAt: new Date()
        });
        let result = null;
        if (action === 'approve') {
            // 执行批准的请求
            try {
                result = await executeApprovedRequest(approval.requestType, approval.requestData);
            }
            catch (error) {
                // 如果执行失败，回滚审核状态
                await approval.update({
                    status: 'pending',
                    reviewedAt: undefined,
                    reviewNotes: `Execution failed: ${error.message}`
                });
                throw error;
            }
        }
        const updatedApproval = await models_1.Approval.findByPk(approvalId, {
            include: [
                {
                    model: models_1.User,
                    as: 'requester',
                    attributes: ['id', 'username', 'displayName']
                },
                {
                    model: models_1.User,
                    as: 'approver',
                    attributes: ['id', 'username', 'displayName']
                },
                {
                    model: models_1.Group,
                    as: 'group',
                    attributes: ['id', 'groupName']
                }
            ]
        });
        res.json({
            success: true,
            data: {
                approval: updatedApproval,
                result
            },
            message: `Request ${action}d successfully`
        });
    }
    catch (error) {
        console.error('Review approval error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to review approval'
        });
    }
};
exports.reviewApproval = reviewApproval;
async function executeApprovedRequest(requestType, requestData) {
    switch (requestType) {
        case 'project_create':
            return await models_1.Project.create({
                ...requestData,
                approvalStatus: 'approved',
                approvedAt: new Date()
            });
        case 'project_update':
            const project = await models_1.Project.findByPk(requestData.id);
            if (!project) {
                throw new Error('Project not found');
            }
            const { id, ...updateData } = requestData;
            return await project.update({
                ...updateData,
                approvalStatus: 'approved',
                approvedAt: new Date()
            });
        case 'execution_create':
            return await models_1.BudgetExecution.create(requestData);
        case 'execution_update':
            const execution = await models_1.BudgetExecution.findByPk(requestData.id);
            if (!execution) {
                throw new Error('Execution record not found');
            }
            const { id: execId, ...execUpdateData } = requestData;
            return await execution.update(execUpdateData);
        case 'project_transfer':
            // 处理项目转移逻辑
            const transferProject = await models_1.Project.findByPk(requestData.projectId);
            if (!transferProject) {
                throw new Error('Project not found');
            }
            return await transferProject.update({
                ownerId: requestData.toUserId,
                groupId: requestData.toGroupId,
                owner: requestData.toOwnerName
            });
        case 'budget_adjustment':
            // 处理预算调整逻辑
            const budgetProject = await models_1.Project.findByPk(requestData.projectId);
            if (!budgetProject) {
                throw new Error('Project not found');
            }
            return await budgetProject.update({
                budgetOccupied: requestData.newBudget
            });
        default:
            throw new Error(`Unknown request type: ${requestType}`);
    }
}
const getApprovalHistory = async (req, res) => {
    try {
        const { userId, role } = req.query;
        let whereClause = {};
        if (role === 'pm') {
            whereClause.approverId = userId;
        }
        else {
            whereClause.requesterId = userId;
        }
        const approvals = await models_1.Approval.findAll({
            where: whereClause,
            include: [
                {
                    model: models_1.User,
                    as: 'requester',
                    attributes: ['id', 'username', 'displayName']
                },
                {
                    model: models_1.User,
                    as: 'approver',
                    attributes: ['id', 'username', 'displayName']
                },
                {
                    model: models_1.Group,
                    as: 'group',
                    attributes: ['id', 'groupName']
                }
            ],
            order: [['submittedAt', 'DESC']],
            limit: 50
        });
        res.json({
            success: true,
            data: approvals
        });
    }
    catch (error) {
        console.error('Get approval history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch approval history'
        });
    }
};
exports.getApprovalHistory = getApprovalHistory;
//# sourceMappingURL=approvalController.js.map