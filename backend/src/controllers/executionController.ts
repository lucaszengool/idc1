import { Request, Response } from 'express';
import { BudgetExecution, Project } from '../models';
import { Op } from 'sequelize';

export const createExecution = async (req: Request, res: Response) => {
  try {
    const { projectId, executionAmount, executionDate, description, createdBy } = req.body;
    let { voucherUrl } = req.body;

    // Check if project exists and has enough remaining budget
    const project = await Project.findByPk(projectId, {
      include: [{ model: BudgetExecution, as: 'executions' }],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const executions = project.get('executions') as BudgetExecution[];
    const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const remainingBudget = parseFloat(project.budgetAmount.toString()) - totalExecuted;

    if (parseFloat(executionAmount) > remainingBudget) {
      return res.status(400).json({ 
        success: false, 
        message: `Execution amount (${executionAmount}) exceeds remaining budget (${remainingBudget.toFixed(2)})` 
      });
    }

    // Handle file upload if present
    if (req.file) {
      voucherUrl = `/uploads/${req.file.filename}`;
    }

    const execution = await BudgetExecution.create({
      projectId: parseInt(projectId),
      executionAmount: parseFloat(executionAmount),
      executionDate: new Date(executionDate),
      description,
      voucherUrl,
      createdBy,
    });

    const executionWithProject = await BudgetExecution.findByPk(execution.id, {
      include: [{ model: Project, as: 'project' }],
    });

    res.status(201).json({ success: true, data: executionWithProject });
  } catch (error) {
    console.error('Create execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to create execution record' });
  }
};

export const getExecutions = async (req: Request, res: Response) => {
  try {
    const { projectId, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const whereClause: any = {};
    if (projectId) whereClause.projectId = projectId;
    if (startDate && endDate) {
      whereClause.executionDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const { count, rows } = await BudgetExecution.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit as string),
      offset,
      order: [['executionDate', 'DESC']],
      include: [{ model: Project, as: 'project' }],
    });

    res.json({
      success: true,
      data: {
        executions: rows,
        totalCount: count,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(count / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Get executions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch execution records' });
  }
};

export const getExecutionsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const executions = await BudgetExecution.findAll({
      where: { projectId },
      order: [['executionDate', 'DESC']],
      include: [{ model: Project, as: 'project' }],
    });

    const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);

    res.json({
      success: true,
      data: {
        executions,
        totalExecuted,
      },
    });
  } catch (error) {
    console.error('Get executions by project error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project execution records' });
  }
};

export const updateExecution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { executionAmount, executionDate, description } = req.body;

    const execution = await BudgetExecution.findByPk(id, {
      include: [{ model: Project, as: 'project' }],
    });

    if (!execution) {
      return res.status(404).json({ success: false, message: 'Execution record not found' });
    }

    // Check budget constraints if amount is being changed
    if (executionAmount && parseFloat(executionAmount) !== parseFloat(execution.executionAmount.toString())) {
      const project = execution.get('project') as Project;
      const otherExecutions = await BudgetExecution.findAll({
        where: { 
          projectId: execution.projectId,
          id: { [Op.ne]: execution.id }
        },
      });

      const otherExecutedAmount = otherExecutions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
      const remainingBudget = parseFloat(project.budgetAmount.toString()) - otherExecutedAmount;

      if (parseFloat(executionAmount) > remainingBudget) {
        return res.status(400).json({ 
          success: false, 
          message: `Execution amount (${executionAmount}) exceeds remaining budget (${remainingBudget.toFixed(2)})` 
        });
      }
    }

    await execution.update({
      executionAmount: executionAmount ? parseFloat(executionAmount) : execution.executionAmount,
      executionDate: executionDate ? new Date(executionDate) : execution.executionDate,
      description: description || execution.description,
    });

    const updatedExecution = await BudgetExecution.findByPk(execution.id, {
      include: [{ model: Project, as: 'project' }],
    });

    res.json({ success: true, data: updatedExecution });
  } catch (error) {
    console.error('Update execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to update execution record' });
  }
};

export const deleteExecution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const execution = await BudgetExecution.findByPk(id);
    if (!execution) {
      return res.status(404).json({ success: false, message: 'Execution record not found' });
    }

    await execution.destroy();
    res.json({ success: true, message: 'Execution record deleted successfully' });
  } catch (error) {
    console.error('Delete execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete execution record' });
  }
};