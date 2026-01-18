"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// 创建项目暂时使用可选认证，因为数据库会被重新创建
router.post('/', authMiddleware_1.optionalAuth, projectController_1.createProject);
// 批量导入项目预算数据
router.post('/batch-import', authMiddleware_1.authenticateUser, projectController_1.batchImportProjects);
// 获取项目列表和详情可以不需要认证，或使用可选认证
router.get('/', authMiddleware_1.optionalAuth, projectController_1.getProjects);
router.get('/:id', authMiddleware_1.optionalAuth, projectController_1.getProjectById);
// 编辑项目需要认证和权限检查
router.put('/:id', authMiddleware_1.authenticateUser, (0, authMiddleware_1.checkProjectPermission)('edit'), projectController_1.updateProject);
// 删除项目需要认证和严格的权限检查
router.delete('/:id', authMiddleware_1.authenticateUser, (0, authMiddleware_1.checkProjectPermission)('delete'), projectController_1.deleteProject);
exports.default = router;
//# sourceMappingURL=projects.js.map