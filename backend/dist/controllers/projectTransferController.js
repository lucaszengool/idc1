"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetReallocationOptions = exports.rejectProjectTransfer = exports.approveProjectTransfer = exports.getProjectTransfers = exports.initiateProjectTransfer = void 0;
const models_1 = require("../models");
const initiateProjectTransfer = async (req, res) => {
    try {
        const { projectId, fromUserId, toUserId, fromGroupId, toGroupId, transferType, transferAmount, reason, requesterId } = req.body;
        if (!projectId || !fromUserId || !toUserId || !fromGroupId || !toGroupId || !transferType || !reason || !requesterId) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }
        // 验证项目存在
        const project = await models_1.Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }
        // 验证用户存在
        const fromUser = await models_1.User.findByPk(fromUserId);
        const toUser = await models_1.User.findByPk(toUserId);
        if (!fromUser || !toUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // 验证组存在
        const fromGroup = await models_1.Group.findByPk(fromGroupId);
        const toGroup = await models_1.Group.findByPk(toGroupId);
        if (!fromGroup || !toGroup) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        // 创建项目转移记录
        const transfer = await models_1.ProjectTransfer.create({
            projectId: parseInt(projectId),
            fromUserId: parseInt(fromUserId),
            toUserId: parseInt(toUserId),
            fromGroupId: parseInt(fromGroupId),
            toGroupId: parseInt(toGroupId),
            transferType,
            transferAmount: transferAmount ? parseFloat(transferAmount) : undefined,
            reason,
            requesterId: parseInt(requesterId),
            status: 'pending'
        });
        // 为目标组的PM创建审核请求
        const approvalData = {
            requestType: 'project_transfer',
            requestData: {
                transferId: transfer.id,
                projectId,
                projectName: project.projectName,
                fromUserName: fromUser.displayName,
                toUserName: toUser.displayName,
                fromGroupName: fromGroup.groupName,
                toGroupName: toGroup.groupName,
                transferType,
                transferAmount,
                reason
            },
            requesterId: parseInt(requesterId),
            approverId: toGroup.pmId,
            groupId: parseInt(toGroupId),
            submittedAt: new Date(),
            status: 'pending'
        };
        const approval = await models_1.Approval.create(approvalData);
        const transferWithDetails = await models_1.ProjectTransfer.findByPk(transfer.id, {
            include: [
                {
                    model: models_1.Project,
                    as: 'project',
                    attributes: ['id', 'projectName', 'projectCode']
                }
            ]
        });
        res.status(201).json({
            success: true,
            data: {
                transfer: transferWithDetails,
                approval
            },
            message: 'Project transfer initiated successfully'
        });
    }
    catch (error) {
        console.error('Initiate project transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate project transfer'
        });
    }
};
exports.initiateProjectTransfer = initiateProjectTransfer;
const getProjectTransfers = async (req, res) => {
    try {
        const { userId, groupId, status } = req.query;
        let whereClause = {};
        if (userId) {
            whereClause = {
                $or: [
                    { fromUserId: userId },
                    { toUserId: userId },
                    { requesterId: userId }
                ]
            };
        }
        if (groupId) {
            if (whereClause.$or) {
                whereClause = {
                    $and: [
                        whereClause,
                        {
                            $or: [
                                { fromGroupId: groupId },
                                { toGroupId: groupId }
                            ]
                        }
                    ]
                };
            }
            else {
                whereClause = {
                    $or: [
                        { fromGroupId: groupId },
                        { toGroupId: groupId }
                    ]
                };
            }
        }
        if (status) {
            whereClause.status = status;
        }
        const transfers = await models_1.ProjectTransfer.findAll({
            where: whereClause,
            include: [
                {
                    model: models_1.Project,
                    as: 'project',
                    attributes: ['id', 'projectName', 'projectCode', 'budgetOccupied']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        // 获取用户和组的详细信息
        const transfersWithDetails = await Promise.all(transfers.map(async (transfer) => {
            const fromUser = await models_1.User.findByPk(transfer.fromUserId, {
                attributes: ['id', 'username', 'displayName']
            });
            const toUser = await models_1.User.findByPk(transfer.toUserId, {
                attributes: ['id', 'username', 'displayName']
            });
            const fromGroup = await models_1.Group.findByPk(transfer.fromGroupId, {
                attributes: ['id', 'groupName']
            });
            const toGroup = await models_1.Group.findByPk(transfer.toGroupId, {
                attributes: ['id', 'groupName']
            });
            return {
                ...transfer.toJSON(),
                fromUser,
                toUser,
                fromGroup,
                toGroup
            };
        }));
        res.json({
            success: true,
            data: transfersWithDetails
        });
    }
    catch (error) {
        console.error('Get project transfers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project transfers'
        });
    }
};
exports.getProjectTransfers = getProjectTransfers;
const approveProjectTransfer = async (req, res) => {
    try {
        const { transferId } = req.params;
        const { approverId, notes } = req.body;
        const transfer = await models_1.ProjectTransfer.findByPk(transferId);
        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: 'Project transfer not found'
            });
        }
        if (transfer.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Transfer has already been processed'
            });
        }
        // 验证审核者权限（目标组的PM）
        const toGroup = await models_1.Group.findByPk(transfer.toGroupId);
        if (!toGroup || toGroup.pmId !== parseInt(approverId)) {
            return res.status(403).json({
                success: false,
                message: 'Only target group PM can approve transfer'
            });
        }
        // 更新转移状态为已批准
        await transfer.update({
            status: 'approved',
            approverId: parseInt(approverId),
            approvedAt: new Date(),
            notes
        });
        // 执行项目转移
        await executeProjectTransfer(transfer);
        // 更新转移状态为已完成
        await transfer.update({
            status: 'completed',
            completedAt: new Date()
        });
        res.json({
            success: true,
            data: transfer,
            message: 'Project transfer approved and completed'
        });
    }
    catch (error) {
        console.error('Approve project transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve project transfer'
        });
    }
};
exports.approveProjectTransfer = approveProjectTransfer;
const rejectProjectTransfer = async (req, res) => {
    try {
        const { transferId } = req.params;
        const { approverId, notes } = req.body;
        const transfer = await models_1.ProjectTransfer.findByPk(transferId);
        if (!transfer) {
            return res.status(404).json({
                success: false,
                message: 'Project transfer not found'
            });
        }
        if (transfer.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Transfer has already been processed'
            });
        }
        // 验证审核者权限（目标组的PM）
        const toGroup = await models_1.Group.findByPk(transfer.toGroupId);
        if (!toGroup || toGroup.pmId !== parseInt(approverId)) {
            return res.status(403).json({
                success: false,
                message: 'Only target group PM can reject transfer'
            });
        }
        // 更新转移状态为已拒绝
        await transfer.update({
            status: 'rejected',
            approverId: parseInt(approverId),
            approvedAt: new Date(),
            notes
        });
        res.json({
            success: true,
            data: transfer,
            message: 'Project transfer rejected'
        });
    }
    catch (error) {
        console.error('Reject project transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject project transfer'
        });
    }
};
exports.rejectProjectTransfer = rejectProjectTransfer;
async function executeProjectTransfer(transfer) {
    const project = await models_1.Project.findByPk(transfer.projectId);
    if (!project) {
        throw new Error('Project not found');
    }
    const toUser = await models_1.User.findByPk(transfer.toUserId);
    if (!toUser) {
        throw new Error('Target user not found');
    }
    switch (transfer.transferType) {
        case 'ownership':
            // 转移项目所有权
            await project.update({
                ownerId: transfer.toUserId,
                groupId: transfer.toGroupId,
                owner: toUser.displayName
            });
            break;
        case 'budget_reallocation':
            // 预算重新分配
            if (transfer.transferAmount) {
                await project.update({
                    budgetOccupied: transfer.transferAmount,
                    ownerId: transfer.toUserId,
                    groupId: transfer.toGroupId,
                    owner: toUser.displayName
                });
            }
            break;
        case 'execution_transfer':
            // 执行权转移（保持预算不变，只转移执行权）
            await project.update({
                ownerId: transfer.toUserId,
                groupId: transfer.toGroupId,
                owner: toUser.displayName
            });
            break;
        default:
            throw new Error(`Unknown transfer type: ${transfer.transferType}`);
    }
}
const getBudgetReallocationOptions = async (req, res) => {
    try {
        const { fromProjectId, toGroupId } = req.query;
        // 获取源项目信息
        const fromProject = await models_1.Project.findByPk(fromProjectId);
        if (!fromProject) {
            return res.status(404).json({
                success: false,
                message: 'Source project not found'
            });
        }
        // 获取目标组的所有项目
        const toGroupProjects = await models_1.Project.findAll({
            where: {
                groupId: parseInt(toGroupId),
                approvalStatus: 'approved'
            },
            attributes: ['id', 'projectName', 'budgetOccupied', 'budgetExecuted']
        });
        // 计算可用预算
        const availableBudget = parseFloat(fromProject.budgetOccupied.toString()) -
            parseFloat(fromProject.budgetExecuted.toString());
        res.json({
            success: true,
            data: {
                sourceProject: {
                    id: fromProject.id,
                    name: fromProject.projectName,
                    totalBudget: fromProject.budgetOccupied,
                    executedBudget: fromProject.budgetExecuted,
                    availableBudget
                },
                targetProjects: toGroupProjects
            }
        });
    }
    catch (error) {
        console.error('Get budget reallocation options error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reallocation options'
        });
    }
};
exports.getBudgetReallocationOptions = getBudgetReallocationOptions;
//# sourceMappingURL=projectTransferController.js.map