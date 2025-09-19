import { Request, Response } from 'express';
import { BudgetExecution, Project } from '../models';
import { Op } from 'sequelize';

export const createExecution = async (req: Request, res: Response) => {
  try {
    const { projectId, executionAmount, executionDate, description, createdBy } = req.body;
    let { voucherUrl } = req.body;

    // Check if project exists and has enough remaining budget
    const project = await Project.findByPk(projectId, {
      include: [{
        model: BudgetExecution,
        as: 'executions',
        required: false
      }],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // 移除预算限制检查，允许超支执行
    const executions = project.get('executions') as BudgetExecution[];
    const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const budgetOccupied = parseFloat(project.budgetOccupied.toString());
    const remainingBudget = budgetOccupied - totalExecuted;

    // 记录超支信息到日志，但不阻止执行
    if (parseFloat(executionAmount) > remainingBudget) {
      console.warn(`项目 ${project.projectCode} 超支执行: 执行金额 ${executionAmount}, 剩余预算 ${remainingBudget.toFixed(2)}, 超支金额 ${(parseFloat(executionAmount) - remainingBudget).toFixed(2)}`);
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

    // 更新项目的budgetExecuted字段
    const newTotalExecuted = totalExecuted + parseFloat(executionAmount);
    await project.update({ budgetExecuted: newTotalExecuted });

    const executionWithProject = await BudgetExecution.findByPk(execution.id, {
      include: [{
        model: Project,
        as: 'executionProject',
        required: false
      }],
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
      include: [{
        model: Project,
        as: 'executionProject',
        required: false
      }],
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
      include: [{
        model: Project,
        as: 'executionProject',
        required: false
      }],
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
      include: [{
        model: Project,
        as: 'executionProject',
        required: false
      }],
    });

    if (!execution) {
      return res.status(404).json({ success: false, message: 'Execution record not found' });
    }

    // Check budget constraints if amount is being changed
    if (executionAmount && parseFloat(executionAmount) !== parseFloat(execution.executionAmount.toString())) {
      const project = execution.get('executionProject') as Project;
      const otherExecutions = await BudgetExecution.findAll({
        where: { 
          projectId: execution.projectId,
          id: { [Op.ne]: execution.id }
        },
      });

      // 移除更新时的预算限制检查，允许超支执行
      const otherExecutedAmount = otherExecutions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
      const budgetOccupied = parseFloat(project.budgetOccupied.toString());
      const remainingBudget = budgetOccupied - otherExecutedAmount;

      // 记录超支信息到日志，但不阻止更新
      if (parseFloat(executionAmount) > remainingBudget) {
        console.warn(`项目 ${project.projectCode} 更新超支: 新执行金额 ${executionAmount}, 剩余预算 ${remainingBudget.toFixed(2)}, 超支金额 ${(parseFloat(executionAmount) - remainingBudget).toFixed(2)}`);
      }
    }

    const oldAmount = parseFloat(execution.executionAmount.toString());
    const newAmount = executionAmount ? parseFloat(executionAmount) : oldAmount;

    await execution.update({
      executionAmount: newAmount,
      executionDate: executionDate ? new Date(executionDate) : execution.executionDate,
      description: description || execution.description,
    });

    // 更新项目的budgetExecuted字段
    const project = execution.get('executionProject') as Project;
    const allExecutions = await BudgetExecution.findAll({
      where: { projectId: execution.projectId },
    });
    const totalExecuted = allExecutions.reduce((sum, exec) =>
      sum + (exec.id === execution.id ? newAmount : parseFloat(exec.executionAmount.toString())), 0
    );
    await project.update({ budgetExecuted: totalExecuted });

    const updatedExecution = await BudgetExecution.findByPk(execution.id, {
      include: [{
        model: Project,
        as: 'executionProject',
        required: false
      }],
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

    // 先获取项目信息和执行金额
    const deletedAmount = parseFloat(execution.executionAmount.toString());
    const projectId = execution.projectId;

    await execution.destroy();

    // 更新项目的budgetExecuted字段
    const project = await Project.findByPk(projectId);
    if (project) {
      const remainingExecutions = await BudgetExecution.findAll({
        where: { projectId },
      });
      const totalExecuted = remainingExecutions.reduce((sum, exec) =>
        sum + parseFloat(exec.executionAmount.toString()), 0
      );
      await project.update({ budgetExecuted: totalExecuted });
    }

    res.json({ success: true, message: 'Execution record deleted successfully' });
  } catch (error) {
    console.error('Delete execution error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete execution record' });
  }
};