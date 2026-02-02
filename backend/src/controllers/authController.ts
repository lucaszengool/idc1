import { Request, Response } from 'express';
import { User, Group, GroupMember } from '../models';
import { Op } from 'sequelize';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = '123456';
const SALT_ROUNDS = 10;

export const loginWithAccessKey = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: '请输入用户名'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '请输入密码'
      });
    }

    // 查找用户（包括未激活的）
    let user = await User.findOne({
      where: { username },
      include: [
        {
          model: GroupMember,
          as: 'groupMemberships',
          include: [
            {
              model: Group,
              as: 'group',
              include: [
                {
                  model: User,
                  as: 'pm',
                  attributes: ['id', 'username', 'displayName']
                }
              ]
            }
          ]
        },
        {
          model: Group,
          as: 'managedGroups'
        }
      ]
    });

    // 如果用户不存在，创建待审批用户
    if (!user) {
      // 生成唯一的access key
      let accessKey: string = '';
      let isUnique = false;
      while (!isUnique) {
        accessKey = crypto.randomBytes(16).toString('hex');
        const existingKey = await User.findOne({ where: { accessKey } });
        if (!existingKey) {
          isUnique = true;
        }
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // 创建待审批用户（isActive=false）
      user = await User.create({
        accessKey,
        username,
        password: hashedPassword,
        displayName: username,
        role: 'employee',
        isActive: false
      });

      return res.status(403).json({
        success: false,
        message: '您的账号注册申请已提交，请等待管理员审批。',
        pendingApproval: true
      });
    }

    // 用户存在但未激活 - 等待审批
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: '您的账号正在等待管理员审批，请稍后再试。',
        pendingApproval: true
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '密码错误，请重试'
      });
    }

    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() });

    // 返回用户信息和组信息
    const userInfo = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      department: user.department,
      position: user.position,
      phone: user.phone,
      accessKey: user.accessKey,
      groups: [],
      managedGroups: []
    };

    res.json({
      success: true,
      data: userInfo,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      displayName,
      email,
      role = 'employee',
      department,
      position,
      phone
    } = req.body;

    if (!username || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Username and display name are required'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // 生成唯一的access key
    let accessKey: string = '';
    let isUnique = false;
    while (!isUnique) {
      accessKey = crypto.randomBytes(16).toString('hex');
      const existingKey = await User.findOne({ where: { accessKey } });
      if (!existingKey) {
        isUnique = true;
      }
    }

    // 默认密码 123456
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    // 创建用户
    const user = await User.create({
      accessKey,
      username,
      password: hashedPassword,
      displayName,
      email,
      role,
      department,
      position,
      phone
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        accessKey: user.accessKey,
        role: user.role,
        department: user.department,
        position: user.position
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '请输入旧密码和新密码'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度不能少于6位'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '旧密码不正确'
      });
    }

    // 设置新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.update({ password: hashedNewPassword });

    res.json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: '密码修改失败'
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      displayName,
      email,
      department,
      position,
      phone,
      role
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 允许修改role
    await user.update({
      displayName,
      email,
      department,
      position,
      phone,
      role
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: GroupMember,
          as: 'groupMemberships',
          include: [
            {
              model: Group,
              as: 'group'
            }
          ]
        },
        {
          model: Group,
          as: 'managedGroups'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      department: user.department,
      position: user.position,
      phone: user.phone,
      groups: [],
      managedGroups: [],
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: userInfo
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'displayName', 'role', 'department', 'position', 'phone', 'isActive', 'lastLoginAt', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

export const toggleUserActive = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.update({ isActive: !user.isActive });
    res.json({
      success: true,
      data: { id: user.id, username: user.username, isActive: user.isActive }
    });
  } catch (error) {
    console.error('Toggle user active error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle user status' });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    await user.update({ password: hashedPassword });
    res.json({
      success: true,
      message: `密码已重置为默认密码 ${DEFAULT_PASSWORD}`
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query, role } = req.query;

    const whereClause: any = {
      isActive: true
    };

    if (query) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${query}%` } },
        { displayName: { [Op.iLike]: `%${query}%` } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'username', 'displayName', 'role', 'department', 'position'],
      limit: 20
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
};
