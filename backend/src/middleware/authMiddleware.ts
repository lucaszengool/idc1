import { Request, Response, NextFunction } from 'express';
import { User, Project, GroupMember, Group } from '../models';

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// 基础认证中间件
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== Authentication Middleware ===');
    console.log('Headers:', {
      authorization: req.headers.authorization,
      'x-access-key': req.headers['x-access-key'],
      'x-username': req.headers['x-username'],
      'x-display-name': req.headers['x-display-name']
    });

    const authHeader = req.headers.authorization;
    const accessKey = req.headers['x-access-key'] || authHeader?.replace('Bearer ', '');

    console.log('Extracted access key:', accessKey);

    if (!accessKey) {
      console.log('No access key provided');
      return res.status(401).json({
        success: false,
        message: 'Access key required'
      });
    }

    console.log('Looking up user with access key:', accessKey);
    const user = await User.findOne({
      where: { accessKey, isActive: true },
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

    console.log('User lookup result:', user ? `Found user: ${user.username}` : 'User not found');

    if (!user) {
      console.log('Invalid access key - user not found or not active');
      return res.status(401).json({
        success: false,
        message: 'Invalid access key'
      });
    }

    req.user = user;
    console.log('Authentication successful for user:', user.username);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// 检查项目权限的中间件
export const checkProjectPermission = (action: 'edit' | 'delete') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: projectId } = req.params;
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '请先登录后再进行此操作'
        });
      }

      // 获取项目信息
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // 权限检查逻辑
      let hasPermission = false;

      // 1. 如果用户是项目负责人(owner)，有完全权限
      if (project.owner === user.username) {
        hasPermission = true;
      }

      // 2. 如果用户是PM角色，有完全权限
      if (user.role === 'pm') {
        hasPermission = true;
      }

      // 3. 检查用户是否是项目所属组的PM
      const managedGroups = user.managedGroups || [];
      for (const group of managedGroups) {
        // 检查项目是否属于该组（可以通过项目分类或其他字段判断）
        if (group.name === project.category || group.category === project.category) {
          hasPermission = true;
          break;
        }
      }

      // 4. 检查用户是否是项目成员（如果项目有成员字段）
      if (project.members && project.members.includes(user.username)) {
        // 项目成员可以编辑，但不能删除
        if (action === 'edit') {
          hasPermission = true;
        }
      }

      // 5. 对于删除操作，需要更严格的权限控制
      if (action === 'delete') {
        // 只有项目负责人和PM可以删除
        hasPermission = (project.owner === user.username) || (user.role === 'pm');
      }

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `您没有权限${action === 'delete' ? '删除' : '编辑'}此项目。只有项目负责人和PM可以进行此操作。`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

// 检查是否为PM角色
export const requirePMRole = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }

  if (user.role !== 'pm') {
    return res.status(403).json({
      success: false,
      message: '此操作需要PM权限'
    });
  }

  next();
};

// 简单的用户认证中间件（用于不需要严格权限控制的接口）
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const accessKey = req.headers['x-access-key'] || authHeader?.replace('Bearer ', '');

    if (accessKey) {
      const user = await User.findOne({
        where: { accessKey, isActive: true },
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

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next(); // 继续执行，即使认证失败
  }
};