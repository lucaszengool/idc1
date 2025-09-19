import { Request, Response } from 'express';
import { BudgetAdjustment, Project, BudgetExecution } from '../models';

export const createAdjustment = async (req: Request, res: Response) => {
  try {
    const {
      originalProjectId,
      newProjectName,
      adjustmentReason,
      adjustmentAmount,
      targetCategory,
      targetProject,
      targetSubProject,
      targetOwner,
    } = req.body;

    // Check if original project exists and has enough remaining budget
    const originalProject = await Project.findByPk(originalProjectId, {
      include: [{
        model: BudgetExecution,
        as: 'executions',
        required: false
      }],
    });

    if (!originalProject) {
      return res.status(404).json({ success: false, message: 'Original project not found' });
    }

    const executions = (originalProject.get('executions') as BudgetExecution[]) || [];
    const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const budgetOccupied = parseFloat((originalProject.budgetOccupied || 0).toString());
    const remainingBudget = budgetOccupied - totalExecuted;

    if (parseFloat(adjustmentAmount) > remainingBudget) {
      return res.status(400).json({ 
        success: false, 
        message: `Adjustment amount (${adjustmentAmount}) exceeds remaining budget (${remainingBudget.toFixed(2)})` 
      });
    }

    // 使用事务确保数据一致性
    const transaction = await originalProject.sequelize!.transaction();

    try {
      // 创建预算调整记录
      const adjustment = await BudgetAdjustment.create({
        originalProjectId: parseInt(originalProjectId),
        newProjectName,
        adjustmentReason,
        adjustmentAmount: parseFloat(adjustmentAmount),
        targetCategory,
        targetProject,
        targetSubProject,
        targetOwner,
      }, { transaction });

      // 更新原项目的预算占用（减少）
      const newBudgetOccupied = budgetOccupied - parseFloat(adjustmentAmount);
      const newRemainingBudget = newBudgetOccupied - totalExecuted;

      await originalProject.update({
        budgetOccupied: newBudgetOccupied,
        remainingBudget: newRemainingBudget,
        budgetAmount: newBudgetOccupied // 向后兼容字段
      }, { transaction });

      // 创建或更新目标项目
      let targetProjectRecord = await Project.findOne({
        where: {
          projectName: targetProject,
          category: targetCategory,
          owner: targetOwner
        },
        transaction
      });

      if (targetProjectRecord) {
        // 如果目标项目存在，增加其预算
        const targetBudgetOccupied = parseFloat((targetProjectRecord.budgetOccupied || 0).toString());
        const targetExecutions = await BudgetExecution.findAll({
          where: { projectId: targetProjectRecord.id },
          transaction
        });
        const targetTotalExecuted = targetExecutions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);

        const newTargetBudgetOccupied = targetBudgetOccupied + parseFloat(adjustmentAmount);
        const newTargetRemainingBudget = newTargetBudgetOccupied - targetTotalExecuted;

        await targetProjectRecord.update({
          budgetOccupied: newTargetBudgetOccupied,
          remainingBudget: newTargetRemainingBudget,
          budgetAmount: newTargetBudgetOccupied, // 向后兼容字段
          subProjectName: targetSubProject || targetProjectRecord.subProjectName
        }, { transaction });
      } else {
        // 如果目标项目不存在，创建新项目
        const projectCode = `ADJ-${Date.now()}`;
        targetProjectRecord = await Project.create({
          projectCode,
          projectName: targetProject,
          projectType: '调整项目',
          projectStatus: '进行中',
          owner: targetOwner,
          members: '',
          projectGoal: `通过预算调整创建的项目：${adjustmentReason}`,
          projectBackground: `原项目：${originalProject.projectName}，调整金额：${adjustmentAmount}万元`,
          projectExplanation: adjustmentReason,
          procurementCode: projectCode,
          completionStatus: '未结项',
          relatedBudgetProject: targetProject,
          budgetYear: originalProject.budgetYear || new Date().getFullYear().toString(),
          budgetOccupied: parseFloat(adjustmentAmount),
          budgetExecuted: 0,
          remainingBudget: parseFloat(adjustmentAmount),
          orderAmount: 0,
          acceptanceAmount: 0,
          contractOrderNumber: '',
          category: targetCategory,
          subProjectName: targetSubProject || targetProject,
          budgetAmount: parseFloat(adjustmentAmount), // 向后兼容字段
          content: `通过预算调整创建的项目：${adjustmentReason}`,
          approvalStatus: 'approved' // 调整项目自动审批
        }, { transaction });
      }

      // 提交事务
      await transaction.commit();

      // 重新查询调整记录以包含关联数据
      const adjustmentWithProject = await BudgetAdjustment.findByPk(adjustment.id, {
        include: [{ model: Project, as: 'originalProject' }],
      });

      res.status(201).json({ success: true, data: adjustmentWithProject });
    } catch (error) {
      // 回滚事务
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create adjustment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create budget adjustment' });
  }
};

export const getAdjustments = async (req: Request, res: Response) => {
  try {
    const { originalProjectId, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const whereClause: any = {};
    if (originalProjectId) whereClause.originalProjectId = originalProjectId;

    const { count, rows } = await BudgetAdjustment.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit as string),
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: Project, as: 'originalProject' }],
    });

    res.json({
      success: true,
      data: {
        adjustments: rows,
        totalCount: count,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(count / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget adjustments' });
  }
};