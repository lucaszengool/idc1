import { Request, Response } from 'express';
import { MonthlyExecution, Project } from '../models';
import { Op } from 'sequelize';

export const createMonthlyExecution = async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      year,
      month,
      planDescription,
      actualDescription,
      isCompleted = false,
    } = req.body;

    const monthlyExecution = await MonthlyExecution.create({
      projectId,
      year,
      month,
      planDescription,
      actualDescription: actualDescription || '',
      isCompleted,
    });

    res.status(201).json({ success: true, data: monthlyExecution });
  } catch (error) {
    console.error('Create monthly execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to create monthly execution' });
  }
};

export const getMonthlyExecutions = async (req: Request, res: Response) => {
  try {
    const { projectId, year, month } = req.query;

    const whereClause: any = {};
    if (projectId) whereClause.projectId = projectId;
    if (year) whereClause.year = year;
    if (month) whereClause.month = month;

    const monthlyExecutions = await MonthlyExecution.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          as: 'project',
        },
      ],
      order: [['year', 'DESC'], ['month', 'DESC']],
    });

    res.json({
      success: true,
      data: monthlyExecutions,
    });
  } catch (error) {
    console.error('Get monthly executions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly executions' });
  }
};

export const updateMonthlyExecution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      planDescription,
      actualDescription,
      isCompleted,
    } = req.body;

    const monthlyExecution = await MonthlyExecution.findByPk(id);
    if (!monthlyExecution) {
      return res.status(404).json({ success: false, message: 'Monthly execution not found' });
    }

    await monthlyExecution.update({
      planDescription,
      actualDescription,
      isCompleted,
    });

    res.json({ success: true, data: monthlyExecution });
  } catch (error) {
    console.error('Update monthly execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to update monthly execution' });
  }
};

export const deleteMonthlyExecution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const monthlyExecution = await MonthlyExecution.findByPk(id);
    if (!monthlyExecution) {
      return res.status(404).json({ success: false, message: 'Monthly execution not found' });
    }

    await monthlyExecution.destroy();
    res.json({ success: true, message: 'Monthly execution deleted successfully' });
  } catch (error) {
    console.error('Delete monthly execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete monthly execution' });
  }
};

// 批量创建项目的月度执行计划
export const createBatchMonthlyExecutions = async (req: Request, res: Response) => {
  try {
    const { projectId, executions } = req.body;

    const createdExecutions = await MonthlyExecution.bulkCreate(
      executions.map((execution: any) => ({
        projectId,
        ...execution,
      })),
      {
        updateOnDuplicate: ['planDescription', 'actualDescription', 'isCompleted'],
      }
    );

    res.status(201).json({ success: true, data: createdExecutions });
  } catch (error) {
    console.error('Create batch monthly executions error:', error);
    res.status(500).json({ success: false, message: 'Failed to create batch monthly executions' });
  }
};

// 获取项目的年度执行计划概览
export const getProjectYearlyPlan = async (req: Request, res: Response) => {
  try {
    const { projectId, year } = req.params;

    const monthlyExecutions = await MonthlyExecution.findAll({
      where: {
        projectId,
        year,
      },
      order: [['month', 'ASC']],
    });

    // 创建12个月的数据结构
    const yearlyPlan = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const execution = monthlyExecutions.find(me => me.month === month);
      return {
        month,
        planDescription: execution?.planDescription || '',
        actualDescription: execution?.actualDescription || '',
        isCompleted: execution?.isCompleted || false,
        id: execution?.id || null,
      };
    });

    res.json({
      success: true,
      data: {
        projectId,
        year,
        monthlyPlans: yearlyPlan,
      },
    });
  } catch (error) {
    console.error('Get project yearly plan error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project yearly plan' });
  }
};