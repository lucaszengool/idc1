import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import {
  authenticateUser,
  checkProjectPermission,
  optionalAuth
} from '../middleware/authMiddleware';

const router = express.Router();

// 创建项目暂时使用可选认证，因为数据库会被重新创建
router.post('/', optionalAuth, createProject);

// 获取项目列表和详情可以不需要认证，或使用可选认证
router.get('/', optionalAuth, getProjects);
router.get('/:id', optionalAuth, getProjectById);

// 编辑项目需要认证和权限检查
router.put('/:id', authenticateUser, checkProjectPermission('edit'), updateProject);

// 删除项目需要认证和严格的权限检查
router.delete('/:id', authenticateUser, checkProjectPermission('delete'), deleteProject);

export default router;