import { Request, Response } from 'express';
import BudgetVersion from '../models/BudgetVersion';
import { TotalBudget } from '../models';
import { Op } from 'sequelize';

// Helper function to sync TotalBudget with BudgetVersion
const syncTotalBudget = async (budgetYear: string, totalBudget: number) => {
  if (!totalBudget || totalBudget <= 0) return;

  const existing = await TotalBudget.findOne({ where: { budgetYear } });
  if (existing) {
    await existing.update({ totalAmount: totalBudget });
    console.log(`Updated TotalBudget for ${budgetYear}: ${totalBudget}万`);
  } else {
    await TotalBudget.create({
      budgetYear,
      totalAmount: totalBudget,
      createdBy: 'system'
    });
    console.log(`Created TotalBudget for ${budgetYear}: ${totalBudget}万`);
  }
};

// 创建预算版本
export const createBudgetVersion = async (req: Request, res: Response) => {
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
    await BudgetVersion.update(
      { isActive: false },
      { where: { budgetYear, isActive: true } }
    );

    const budgetVersion = await BudgetVersion.create({
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

    // Sync TotalBudget when creating a new active version
    if (totalBudget) {
      await syncTotalBudget(budgetYear, parseFloat(totalBudget));
    }

    res.status(201).json({
      success: true,
      message: '预算版本创建成功',
      data: budgetVersion,
    });
  } catch (error) {
    console.error('Create budget version error:', error);
    res.status(500).json({
      success: false,
      message: '预算版本创建失败',
    });
  }
};

// 获取所有预算版本
export const getAllBudgetVersions = async (req: Request, res: Response) => {
  try {
    const { budgetYear, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const whereClause: any = {};
    if (budgetYear) {
      whereClause.budgetYear = budgetYear;
    }

    const { count, rows } = await BudgetVersion.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit as string),
      offset,
    });

    res.json({
      success: true,
      data: {
        versions: rows,
        totalCount: count,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(count / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get budget versions error:', error);
    res.status(500).json({
      success: false,
      message: '获取预算版本失败',
    });
  }
};

// 获取当前激活的预算版本
export const getActiveBudgetVersion = async (req: Request, res: Response) => {
  try {
    const { budgetYear } = req.params;

    const activeVersion = await BudgetVersion.findOne({
      where: {
        budgetYear,
        isActive: true,
      },
    });

    res.json({
      success: true,
      data: activeVersion,
    });
  } catch (error) {
    console.error('Get active budget version error:', error);
    res.status(500).json({
      success: false,
      message: '获取激活版本失败',
    });
  }
};

// 设置激活版本
export const setActiveBudgetVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const version = await BudgetVersion.findByPk(id);
    if (!version) {
      return res.status(404).json({
        success: false,
        message: '版本不存在',
      });
    }

    // 将同年份的其他版本设置为非激活
    await BudgetVersion.update(
      { isActive: false },
      { where: { budgetYear: version.budgetYear } }
    );

    // 设置当前版本为激活
    await version.update({ isActive: true });

    // Sync TotalBudget when activating a version with totalBudget
    if (version.totalBudget) {
      await syncTotalBudget(version.budgetYear, parseFloat(version.totalBudget.toString()));
    }

    res.json({
      success: true,
      message: '激活版本设置成功',
      data: version,
    });
  } catch (error) {
    console.error('Set active budget version error:', error);
    res.status(500).json({
      success: false,
      message: '设置激活版本失败',
    });
  }
};

// 删除预算版本
export const deleteBudgetVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const version = await BudgetVersion.findByPk(id);
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
  } catch (error) {
    console.error('Delete budget version error:', error);
    res.status(500).json({
      success: false,
      message: '删除预算版本失败',
    });
  }
};
