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
      include: [{ model: BudgetExecution, as: 'executions' }],
    });

    if (!originalProject) {
      return res.status(404).json({ success: false, message: 'Original project not found' });
    }

    const executions = originalProject.get('executions') as BudgetExecution[];
    const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const remainingBudget = parseFloat(originalProject.budgetAmount.toString()) - totalExecuted;

    if (parseFloat(adjustmentAmount) > remainingBudget) {
      return res.status(400).json({ 
        success: false, 
        message: `Adjustment amount (${adjustmentAmount}) exceeds remaining budget (${remainingBudget.toFixed(2)})` 
      });
    }

    const adjustment = await BudgetAdjustment.create({
      originalProjectId: parseInt(originalProjectId),
      newProjectName,
      adjustmentReason,
      adjustmentAmount: parseFloat(adjustmentAmount),
      targetCategory,
      targetProject,
      targetSubProject,
      targetOwner,
    });

    const adjustmentWithProject = await BudgetAdjustment.findByPk(adjustment.id, {
      include: [{ model: Project, as: 'originalProject' }],
    });

    res.status(201).json({ success: true, data: adjustmentWithProject });
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