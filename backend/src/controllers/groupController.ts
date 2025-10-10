import { Request, Response } from 'express';
import { User, Group, GroupMember } from '../models';
import { Op } from 'sequelize';

export const createGroup = async (req: Request, res: Response) => {
  try {
    const {
      groupName,
      description,
      pmId,
      createdBy
    } = req.body;

    if (!groupName || !pmId || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Group name, PM ID, and creator ID are required'
      });
    }

    // 验证PM是否为PM角色
    const pm = await User.findByPk(pmId);
    if (!pm || pm.role !== 'pm') {
      return res.status(400).json({
        success: false,
        message: 'PM must have PM role'
      });
    }

    // 创建组
    const group = await Group.create({
      groupName,
      description,
      pmId,
      createdBy
    });

    // 自动将PM添加到组中
    await GroupMember.create({
      groupId: group.id,
      userId: pmId,
      addedBy: createdBy
    });

    const groupWithPM = await Group.findByPk(group.id, {
      include: [
        {
          model: User,
          as: 'pm',
          attributes: ['id', 'username', 'displayName', 'role']
        },
        {
          model: GroupMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'displayName', 'role']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: groupWithPM,
      message: 'Group created successfully'
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create group'
    });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    let whereClause: any = {
      isActive: true
    };

    // 如果指定了用户ID，只返回该用户相关的组
    if (userId) {
      const user = await User.findByPk(userId as string);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // 如果是PM，返回管理的组和参与的组
      if (user.role === 'pm') {
        const groups = await Group.findAll({
          where: {
            isActive: true,
            [Op.or]: [
              { pmId: parseInt(userId as string) },
              { id: { [Op.in]: await GroupMember.findAll({ where: { userId: parseInt(userId as string) }, attributes: ['groupId'] }).then(members => members.map(m => m.groupId)) } }
            ]
          },
          include: [
            {
              model: User,
              as: 'pm',
              attributes: ['id', 'username', 'displayName', 'role']
            },
            {
              model: GroupMember,
              as: 'members',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'username', 'displayName', 'role']
                }
              ]
            }
          ]
        });
        return res.json({
          success: true,
          data: groups
        });
      }
    }

    const groups = await Group.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'pm',
          attributes: ['id', 'username', 'displayName', 'role']
        },
        {
          model: GroupMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'displayName', 'role']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: groups
    });

  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch groups'
    });
  }
};

export const addGroupMember = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId, username, displayName, addedBy } = req.body;

    if (!addedBy) {
      return res.status(400).json({
        success: false,
        message: 'Adder ID is required'
      });
    }

    // 验证组是否存在
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // 验证添加者是否为该组的PM
    if (group.pmId !== parseInt(addedBy)) {
      return res.status(403).json({
        success: false,
        message: 'Only group PM can add members'
      });
    }

    let user: User | null = null;

    // 如果提供了userId，直接使用（旧方式兼容）
    if (userId) {
      user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    }
    // 如果提供了username和displayName，查找或创建用户（新方式）
    else if (username && displayName) {
      if (!username.trim() || !displayName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Username and display name cannot be empty'
        });
      }

      // 查找是否已存在该用户名的用户
      user = await User.findOne({ where: { username: username.trim() } });

      if (!user) {
        // 用户不存在，自动创建
        const crypto = require('crypto');
        const accessKey = crypto.randomBytes(32).toString('hex');

        user = await User.create({
          username: username.trim(),
          displayName: displayName.trim(),
          role: 'employee', // 默认为员工角色
          accessKey: accessKey,
          isActive: true
        });

        console.log(`Auto-created user: ${username} with display name: ${displayName}`);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Either userId or (username and displayName) must be provided'
      });
    }

    // 检查用户是否已在组中
    const existingMember = await GroupMember.findOne({
      where: {
        groupId,
        userId: user.id
      }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this group'
      });
    }

    // 添加用户到组
    const groupMember = await GroupMember.create({
      groupId: parseInt(groupId),
      userId: user.id,
      addedBy: parseInt(addedBy)
    });

    const memberWithUser = await GroupMember.findByPk(groupMember.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'displayName', 'role']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: memberWithUser,
      message: 'Member added successfully'
    });

  } catch (error) {
    console.error('Add group member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add group member'
    });
  }
};

export const removeGroupMember = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.params;
    const { removedBy } = req.body;

    // 验证组是否存在
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // 验证移除者是否为该组的PM
    if (group.pmId !== parseInt(removedBy)) {
      return res.status(403).json({
        success: false,
        message: 'Only group PM can remove members'
      });
    }

    // 不能移除PM自己
    if (group.pmId === parseInt(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove PM from group'
      });
    }

    // 查找并删除组成员
    const member = await GroupMember.findOne({
      where: {
        groupId,
        userId
      }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this group'
      });
    }

    await member.destroy();

    res.json({
      success: true,
      message: 'Member removed successfully'
    });

  } catch (error) {
    console.error('Remove group member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove group member'
    });
  }
};

export const searchUsersForGroup = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const { groupId } = req.params;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // 获取已在组中的用户ID列表
    const existingMemberIds = await GroupMember.findAll({
      where: { groupId },
      attributes: ['userId']
    }).then(members => members.map(m => m.userId));

    // 搜索不在组中的用户
    const users = await User.findAll({
      where: {
        isActive: true,
        id: { [Op.notIn]: existingMemberIds },
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { displayName: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'username', 'displayName', 'role', 'department', 'position'],
      limit: 10
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Search users for group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { groupName, description, updatedBy } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // 验证更新者是否为该组的PM
    if (group.pmId !== parseInt(updatedBy)) {
      return res.status(403).json({
        success: false,
        message: 'Only group PM can update group information'
      });
    }

    await group.update({
      groupName,
      description
    });

    const updatedGroup = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          as: 'pm',
          attributes: ['id', 'username', 'displayName', 'role']
        },
        {
          model: GroupMember,
          as: 'members',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'displayName', 'role']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: updatedGroup,
      message: 'Group updated successfully'
    });

  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update group'
    });
  }
};