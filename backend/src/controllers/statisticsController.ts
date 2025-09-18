import { Request, Response } from 'express';
import { Project, BudgetExecution, TotalBudget } from '../models';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear().toString();

    // Get total budget for current year
    const totalBudgetRecord = await TotalBudget.findOne({
      where: { budgetYear: currentYear }
    });

    // Get all projects with their executions
    const projects = await Project.findAll({
      include: [{
        model: BudgetExecution,
        as: 'executions',
        required: false // LEFT JOIN to include projects without executions
      }],
    });

    // Calculate statistics
    const totalBudgetAmount = totalBudgetRecord ? parseFloat(totalBudgetRecord.totalAmount.toString()) : 0;
    let allocatedBudget = 0;
    let totalExecuted = 0;
    const categoryStats: any[] = [];
    const highRiskProjects: any[] = [];

    const categoryMap = new Map();

    projects.forEach((project: any) => {
      const budgetAmount = parseFloat(project.budgetOccupied || project.budgetAmount || 0);
      allocatedBudget += budgetAmount;

      const executions = project.executions || [];
      const executedAmount = executions.reduce((sum: number, exec: any) =>
        sum + parseFloat(exec.executionAmount), 0);
      totalExecuted += executedAmount;

      const executionRate = budgetAmount > 0 ? (executedAmount / budgetAmount) * 100 : 0;

      // Track category stats
      const category = project.category || project.projectType || '未分类';
      if (categoryMap.has(category)) {
        const cat = categoryMap.get(category);
        cat.totalBudget += budgetAmount;
        cat.projectCount += 1;
      } else {
        categoryMap.set(category, {
          category,
          totalBudget: budgetAmount,
          projectCount: 1,
        });
      }

      // Check for high-risk projects (execution rate > 80%)
      if (executionRate > 80) {
        highRiskProjects.push({
          id: project.id,
          projectName: project.projectName,
          budgetAmount,
          executedAmount,
          executionRate,
        });
      }
    });

    // Convert category map to array
    categoryMap.forEach((value) => {
      categoryStats.push(value);
    });

    // Get recent executions
    const recentExecutions = await BudgetExecution.findAll({
      include: [{
        model: Project,
        as: 'executionProject',
        required: false
      }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    const availableBudget = totalBudgetAmount - allocatedBudget;
    const remainingBudget = allocatedBudget - totalExecuted;
    const executionRate = allocatedBudget > 0 ? (totalExecuted / allocatedBudget) * 100 : 0;

    res.json({
      success: true,
      data: {
        总预算: totalBudgetAmount,
        已分配预算: allocatedBudget,
        可支配预算: availableBudget,
        已执行金额: totalExecuted,
        剩余预算: remainingBudget,
        预算执行率: parseFloat(executionRate.toFixed(2)),
        项目总数: projects.length,
        categoryStats,
        recentExecutions,
        highRiskProjects,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

export const getStatisticsByCategory = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get statistics by category error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category statistics' });
  }
};

export const getStatisticsByOwner = async (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get statistics by owner error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch owner statistics' });
  }
};

export const getTotalStatistics = async (req: Request, res: Response) => {
  try {
    res.json({ 
      success: true, 
      data: {
        summary: {},
        monthlyTrends: [],
      }
    });
  } catch (error) {
    console.error('Get total statistics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch total statistics' });
  }
};