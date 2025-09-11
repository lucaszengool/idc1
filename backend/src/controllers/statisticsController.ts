import { Request, Response } from 'express';
import { Project, BudgetExecution } from '../models';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    // Get all projects with their executions
    const projects = await Project.findAll({
      include: [{ model: BudgetExecution, as: 'executions' }],
    });

    // Calculate statistics
    let totalBudget = 0;
    let totalExecuted = 0;
    const categoryStats: any[] = [];
    const highRiskProjects: any[] = [];

    const categoryMap = new Map();

    projects.forEach((project: any) => {
      const budgetAmount = parseFloat(project.budgetAmount);
      totalBudget += budgetAmount;

      const executions = project.executions || [];
      const executedAmount = executions.reduce((sum: number, exec: any) => 
        sum + parseFloat(exec.executionAmount), 0);
      totalExecuted += executedAmount;

      const executionRate = budgetAmount > 0 ? (executedAmount / budgetAmount) * 100 : 0;

      // Track category stats
      if (categoryMap.has(project.category)) {
        const cat = categoryMap.get(project.category);
        cat.totalBudget += budgetAmount;
        cat.projectCount += 1;
      } else {
        categoryMap.set(project.category, {
          category: project.category,
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
      include: [{ model: Project, as: 'project' }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    const remainingBudget = totalBudget - totalExecuted;
    const executionRate = totalBudget > 0 ? (totalExecuted / totalBudget) * 100 : 0;

    res.json({
      success: true,
      data: {
        总预算: totalBudget,
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