"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudgetVersion = exports.setActiveBudgetVersion = exports.getActiveBudgetVersion = exports.getAllBudgetVersions = exports.createBudgetVersion = void 0;
const BudgetVersion_1 = __importDefault(require("../models/BudgetVersion"));
// 创建预算版本
const createBudgetVersion = async (req, res) => {
    try {
        const { versionName, budgetYear, description, totalBudget } = req.body;
        const uploadedBy = req.body.uploadedBy || 'yangwenyu';
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请上传预算文件',
            });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        // 将之前的版本设置为非激活状态
        await BudgetVersion_1.default.update({ isActive: false }, { where: { budgetYear, isActive: true } });
        const budgetVersion = await BudgetVersion_1.default.create({
            versionName,
            budgetYear,
            fileUrl,
            fileName,
            fileType,
            uploadedBy,
            description,
            isActive: true,
            totalBudget: totalBudget ? parseFloat(totalBudget) : undefined,
        });
        res.status(201).json({
            success: true,
            message: '预算版本创建成功',
            data: budgetVersion,
        });
    }
    catch (error) {
        console.error('Create budget version error:', error);
        res.status(500).json({
            success: false,
            message: '预算版本创建失败',
        });
    }
};
exports.createBudgetVersion = createBudgetVersion;
// 获取所有预算版本
const getAllBudgetVersions = async (req, res) => {
    try {
        const { budgetYear, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const whereClause = {};
        if (budgetYear) {
            whereClause.budgetYear = budgetYear;
        }
        const { count, rows } = await BudgetVersion_1.default.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });
        res.json({
            success: true,
            data: {
                versions: rows,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / parseInt(limit)),
            },
        });
    }
    catch (error) {
        console.error('Get budget versions error:', error);
        res.status(500).json({
            success: false,
            message: '获取预算版本失败',
        });
    }
};
exports.getAllBudgetVersions = getAllBudgetVersions;
// 获取当前激活的预算版本
const getActiveBudgetVersion = async (req, res) => {
    try {
        const { budgetYear } = req.params;
        const activeVersion = await BudgetVersion_1.default.findOne({
            where: {
                budgetYear,
                isActive: true,
            },
        });
        res.json({
            success: true,
            data: activeVersion,
        });
    }
    catch (error) {
        console.error('Get active budget version error:', error);
        res.status(500).json({
            success: false,
            message: '获取激活版本失败',
        });
    }
};
exports.getActiveBudgetVersion = getActiveBudgetVersion;
// 设置激活版本
const setActiveBudgetVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const version = await BudgetVersion_1.default.findByPk(id);
        if (!version) {
            return res.status(404).json({
                success: false,
                message: '版本不存在',
            });
        }
        // 将同年份的其他版本设置为非激活
        await BudgetVersion_1.default.update({ isActive: false }, { where: { budgetYear: version.budgetYear } });
        // 设置当前版本为激活
        await version.update({ isActive: true });
        res.json({
            success: true,
            message: '激活版本设置成功',
            data: version,
        });
    }
    catch (error) {
        console.error('Set active budget version error:', error);
        res.status(500).json({
            success: false,
            message: '设置激活版本失败',
        });
    }
};
exports.setActiveBudgetVersion = setActiveBudgetVersion;
// 删除预算版本
const deleteBudgetVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const version = await BudgetVersion_1.default.findByPk(id);
        if (!version) {
            return res.status(404).json({
                success: false,
                message: '版本不存在',
            });
        }
        await version.destroy();
        res.json({
            success: true,
            message: '预算版本删除成功',
        });
    }
    catch (error) {
        console.error('Delete budget version error:', error);
        res.status(500).json({
            success: false,
            message: '删除预算版本失败',
        });
    }
};
exports.deleteBudgetVersion = deleteBudgetVersion;
//# sourceMappingURL=budgetVersionController.js.map