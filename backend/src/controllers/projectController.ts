import { Request, Response } from 'express';
import { Project, BudgetExecution } from '../models';
import { Op } from 'sequelize';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { category, projectName, subProjectName, owner, budgetAmount, content } = req.body;

    const project = await Project.create({
      category,
      projectName,
      subProjectName,
      owner,
      budgetAmount: parseFloat(budgetAmount),
      content,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { category, owner, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (owner) whereClause.owner = { [Op.iLike]: `%${owner}%` };

    const { count, rows } = await Project.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit as string),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: BudgetExecution,
          as: 'executions',
          attributes: ['executionAmount'],
        },
      ],
    });

    const projectsWithStats = rows.map(project => {
      const executions = project.get('executions') as BudgetExecution[];
      const executedAmount = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
      const remainingAmount = parseFloat(project.budgetAmount.toString()) - executedAmount;
      const executionRate = parseFloat(project.budgetAmount.toString()) > 0 
        ? (executedAmount / parseFloat(project.budgetAmount.toString())) * 100 
        : 0;

      return {
        ...project.toJSON(),
        executedAmount,
        remainingAmount,
        executionRate: parseFloat(executionRate.toFixed(2)),
      };
    });

    res.json({
      success: true,
      data: {
        projects: projectsWithStats,
        totalCount: count,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(count / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: BudgetExecution,
          as: 'executions',
          order: [['executionDate', 'DESC']],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const executions = project.get('executions') as BudgetExecution[];
    const executedAmount = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const remainingAmount = parseFloat(project.budgetAmount.toString()) - executedAmount;
    const executionRate = parseFloat(project.budgetAmount.toString()) > 0 
      ? (executedAmount / parseFloat(project.budgetAmount.toString())) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        ...project.toJSON(),
        executedAmount,
        remainingAmount,
        executionRate: parseFloat(executionRate.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, projectName, subProjectName, owner, budgetAmount, content } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.update({
      category,
      projectName,
      subProjectName,
      owner,
      budgetAmount: parseFloat(budgetAmount),
      content,
    });

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.destroy();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};