import { Request, Response } from 'express';
import { User, Group, GroupMember, Approval, Project, BudgetExecution } from '../models';
import { Op } from 'sequelize';

export const submitForApproval = async (req: Request, res: Response) => {
  try {
    const {
      requestType,
      requestData,
      requesterId,
      groupId
    } = req.body;

    if (!requestType || !requestData || !requesterId || !groupId) {
      return res.status(400).json({
        success: false,
        message: 'Request type, data, requester ID, and group ID are required'
      });
    }

    // 验证组是否存在并获取PM
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
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
    const membership = await GroupMember.findOne({
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
    const approval = await Approval.create({
      requestType,
      requestData,
      requesterId: parseInt(requesterId),
      approverId: group.pmId,
      groupId: parseInt(groupId),
      status: 'pending',
      submittedAt: new Date()
    });

    const approvalWithDetails = await Approval.findByPk(approval.id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Group,
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

  } catch (error) {
    console.error('Submit for approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit request for approval'
    });
  }
};

export const getPendingApprovals = async (req: Request, res: Response) => {
  try {
    const { approverId } = req.params;

    const approvals = await Approval.findAll({
      where: {
        approverId: parseInt(approverId),
        status: 'pending'
      },
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'username', 'displayName', 'role']
        },
        {
          model: Group,
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

  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals'
    });
  }
};

export const reviewApproval = async (req: Request, res: Response) => {
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

    const approval = await Approval.findByPk(approvalId);
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
      } catch (error) {
        // 如果执行失败，回滚审核状态
        await approval.update({
          status: 'pending',
          reviewedAt: undefined,
          reviewNotes: `Execution failed: ${(error as Error).message}`
        });
        throw error;
      }
    }

    const updatedApproval = await Approval.findByPk(approvalId, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Group,
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

  } catch (error) {
    console.error('Review approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review approval'
    });
  }
};

async function executeApprovedRequest(requestType: string, requestData: any) {
  switch (requestType) {
    case 'project_create':
      return await Project.create({
        ...requestData,
        approvalStatus: 'approved',
        approvedAt: new Date()
      });

    case 'project_update':
      const project = await Project.findByPk(requestData.id);
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
      return await BudgetExecution.create(requestData);

    case 'execution_update':
      const execution = await BudgetExecution.findByPk(requestData.id);
      if (!execution) {
        throw new Error('Execution record not found');
      }
      const { id: execId, ...execUpdateData } = requestData;
      return await execution.update(execUpdateData);

    case 'project_transfer':
      // 处理项目转移逻辑
      const transferProject = await Project.findByPk(requestData.projectId);
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
      const budgetProject = await Project.findByPk(requestData.projectId);
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

export const getApprovalHistory = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.query;

    let whereClause: any = {};

    if (role === 'pm') {
      whereClause.approverId = userId;
    } else {
      whereClause.requesterId = userId;
    }

    const approvals = await Approval.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Group,
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

  } catch (error) {
    console.error('Get approval history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval history'
    });
  }
};