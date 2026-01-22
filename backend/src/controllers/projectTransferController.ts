import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User, Group, ProjectTransfer, Project, Approval } from '../models';

export const initiateProjectTransfer = async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      fromUserId,
      toUserId,
      fromGroupId,
      toGroupId,
      fromUserName,
      toUserName,
      fromGroupName,
      toGroupName,
      transferType,
      transferAmount,
      reason,
      requesterId
    } = req.body;

    // 验证必填字段
    if (!projectId || !transferType || !reason || !requesterId) {
      return res.status(400).json({
        success: false,
        message: 'Project, transfer type, reason and requester are required'
      });
    }

    // 验证项目存在
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // 查找用户（支持ID或用户名/显示名）
    let fromUser, toUser;

    if (fromUserId) {
      fromUser = await User.findByPk(fromUserId);
    } else if (fromUserName) {
      fromUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: fromUserName },
            { displayName: fromUserName }
          ]
        }
      });
    }

    if (toUserId) {
      toUser = await User.findByPk(toUserId);
    } else if (toUserName) {
      toUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: toUserName },
            { displayName: toUserName }
          ]
        }
      });
    }

    if (!fromUser || !toUser) {
      return res.status(404).json({
        success: false,
        message: `User not found: ${!fromUser ? 'fromUser' : 'toUser'}`
      });
    }

    // 查找组（支持ID或组名）
    let fromGroup, toGroup;

    if (fromGroupId) {
      fromGroup = await Group.findByPk(fromGroupId);
    } else if (fromGroupName) {
      fromGroup = await Group.findOne({
        where: { groupName: fromGroupName }
      });
    }

    if (toGroupId) {
      toGroup = await Group.findByPk(toGroupId);
    } else if (toGroupName) {
      toGroup = await Group.findOne({
        where: { groupName: toGroupName }
      });
    }

    if (!fromGroup || !toGroup) {
      return res.status(404).json({
        success: false,
        message: `Group not found: ${!fromGroup ? fromGroupName || 'fromGroup' : toGroupName || 'toGroup'}`
      });
    }

    // 创建项目转移记录
    const transfer = await ProjectTransfer.create({
      projectId: parseInt(projectId),
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      fromGroupId: fromGroup.id,
      toGroupId: toGroup.id,
      transferType,
      transferAmount: transferAmount ? parseFloat(transferAmount) : undefined,
      reason,
      requesterId: parseInt(requesterId),
      status: 'pending'
    });

    // 为目标组的PM创建审核请求
    const approvalData = {
      requestType: 'project_transfer' as const,
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
      groupId: toGroup.id,
      submittedAt: new Date(),
      status: 'pending' as const
    };

    const approval = await Approval.create(approvalData);

    const transferWithDetails = await ProjectTransfer.findByPk(transfer.id, {
      include: [
        {
          model: Project,
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

  } catch (error) {
    console.error('Initiate project transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate project transfer'
    });
  }
};

export const getProjectTransfers = async (req: Request, res: Response) => {
  try {
    const { userId, groupId, status } = req.query;

    let whereClause: any = {};

    if (userId) {
      const userIdNum = parseInt(userId as string);
      whereClause = {
        [Op.or]: [
          { fromUserId: userIdNum },
          { toUserId: userIdNum },
          { requesterId: userIdNum }
        ]
      };
    }

    if (groupId) {
      const groupIdNum = parseInt(groupId as string);
      if (whereClause[Op.or]) {
        whereClause = {
          [Op.and]: [
            whereClause,
            {
              [Op.or]: [
                { fromGroupId: groupIdNum },
                { toGroupId: groupIdNum }
              ]
            }
          ]
        };
      } else {
        whereClause = {
          [Op.or]: [
            { fromGroupId: groupIdNum },
            { toGroupId: groupIdNum }
          ]
        };
      }
    }

    if (status) {
      whereClause.status = status;
    }

    const transfers = await ProjectTransfer.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode', 'budgetOccupied']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // 获取用户和组的详细信息
    const transfersWithDetails = await Promise.all(transfers.map(async (transfer) => {
      const fromUser = await User.findByPk(transfer.fromUserId, {
        attributes: ['id', 'username', 'displayName']
      });
      const toUser = await User.findByPk(transfer.toUserId, {
        attributes: ['id', 'username', 'displayName']
      });
      const fromGroup = await Group.findByPk(transfer.fromGroupId, {
        attributes: ['id', 'groupName']
      });
      const toGroup = await Group.findByPk(transfer.toGroupId, {
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

  } catch (error) {
    console.error('Get project transfers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project transfers'
    });
  }
};

export const approveProjectTransfer = async (req: Request, res: Response) => {
  try {
    const { transferId } = req.params;
    const { approverId, notes } = req.body;

    const transfer = await ProjectTransfer.findByPk(transferId);
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
    const toGroup = await Group.findByPk(transfer.toGroupId);
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

  } catch (error) {
    console.error('Approve project transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve project transfer'
    });
  }
};

export const rejectProjectTransfer = async (req: Request, res: Response) => {
  try {
    const { transferId } = req.params;
    const { approverId, notes } = req.body;

    const transfer = await ProjectTransfer.findByPk(transferId);
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
    const toGroup = await Group.findByPk(transfer.toGroupId);
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

  } catch (error) {
    console.error('Reject project transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject project transfer'
    });
  }
};

async function executeProjectTransfer(transfer: any) {
  const project = await Project.findByPk(transfer.projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const toUser = await User.findByPk(transfer.toUserId);
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

export const getBudgetReallocationOptions = async (req: Request, res: Response) => {
  try {
    const { fromProjectId, toGroupId } = req.query;

    // 获取源项目信息
    const fromProject = await Project.findByPk(fromProjectId as string);
    if (!fromProject) {
      return res.status(404).json({
        success: false,
        message: 'Source project not found'
      });
    }

    // 获取目标组的所有项目
    const toGroupProjects = await Project.findAll({
      where: {
        groupId: parseInt(toGroupId as string),
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

  } catch (error) {
    console.error('Get budget reallocation options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reallocation options'
    });
  }
};