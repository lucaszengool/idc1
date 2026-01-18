import { Request, Response } from 'express';
import { Project, BudgetExecution, MonthlyExecution, BudgetAdjustment, ProjectTransfer } from '../models';
import { Op } from 'sequelize';

export const createProject = async (req: Request, res: Response) => {
  try {
    console.log('Create project request body:', req.body);
    console.log('User from request:', req.user);

    const {
      projectCode,
      projectName,
      projectType,
      projectStatus,
      owner,
      members,
      projectGoal,
      projectBackground,
      projectExplanation,
      procurementCode,
      completionStatus,
      relatedBudgetProject,
      budgetYear,
      budgetOccupied,
      orderAmount,
      acceptanceAmount,
      contractOrderNumber,
      expectedAcceptanceTime,
      // 向后兼容字段
      category,
      subProjectName,
      budgetAmount,
      content,
    } = req.body;

    // 生成项目编号（如果没有提供）
    const finalProjectCode = projectCode || `DCOPS-${Date.now()}`;
    const finalProjectName = projectName || subProjectName;
    const finalBudgetAmount = parseFloat(budgetOccupied || budgetAmount || 0);

    console.log('Final project data to create:', {
      finalProjectCode,
      finalProjectName,
      finalBudgetAmount,
      category: category || 'IDC-架构研发',
      owner,
      content: content || '项目描述'
    });

    // 确保所有必填字段都有值
    const projectData = {
      projectCode: finalProjectCode,
      projectName: finalProjectName,
      projectType: projectType || '常规',
      projectStatus: projectStatus || '待开始',
      owner: owner || '待指定',
      members: members || '',
      projectGoal: projectGoal || content || '待完善项目目标',
      projectBackground: projectBackground || content || '待完善项目背景',
      projectExplanation: projectExplanation || content || '待完善推导说明',
      procurementCode: procurementCode || finalProjectCode,
      completionStatus: completionStatus || '未结项',
      relatedBudgetProject: relatedBudgetProject || finalProjectName,
      budgetYear: (budgetYear || new Date().getFullYear()).toString(),
      budgetOccupied: finalBudgetAmount,
      budgetExecuted: 0, // 初始执行金额为0
      remainingBudget: finalBudgetAmount, // 初始剩余 = 预算占用
      orderAmount: parseFloat(orderAmount || '0'),
      acceptanceAmount: parseFloat(acceptanceAmount || '0'),
      contractOrderNumber: contractOrderNumber || '',
      expectedAcceptanceTime: expectedAcceptanceTime ? new Date(expectedAcceptanceTime) : undefined,
      approvalStatus: 'draft' as const, // 默认为草稿状态
      // 向后兼容字段
      category: category || 'IDC-架构研发',
      subProjectName: subProjectName || finalProjectName,
      budgetAmount: finalBudgetAmount, // 向后兼容
      content: content || projectBackground || '项目描述',
    };

    console.log('Final project data to create (detailed):', projectData);

    const project = await Project.create(projectData);

    console.log('Project created successfully:', project.toJSON());
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error details:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { category, owner, year, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (owner) whereClause.owner = { [Op.iLike]: `%${owner}%` };
    if (year) whereClause.budgetYear = year;

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
          required: false,
        },
      ],
    });

    // 更新每个项目的budgetExecuted字段
    for (const project of rows) {
      const executions = project.get('executions') as BudgetExecution[];
      const totalExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);

      // 更新项目的budgetExecuted字段
      await project.update({ budgetExecuted: totalExecuted });
    }

    const projectsWithStats = rows.map(project => {
      const executions = project.get('executions') as BudgetExecution[];
      const budgetOccupied = parseFloat(project.budgetOccupied.toString());
      const budgetExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
      const remainingBudget = budgetOccupied - budgetExecuted;
      const executionRate = budgetOccupied > 0
        ? (budgetExecuted / budgetOccupied) * 100
        : 0;

      return {
        ...project.toJSON(),
        budgetExecuted,
        remainingBudget,
        executionRate: parseFloat(executionRate.toFixed(2)),
        // 向后兼容
        executedAmount: budgetExecuted,
        remainingAmount: remainingBudget,
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
          required: false,
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const executions = project.get('executions') as BudgetExecution[];
    const budgetOccupied = parseFloat(project.budgetOccupied.toString());
    const budgetExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const remainingBudget = budgetOccupied - budgetExecuted;
    const executionRate = budgetOccupied > 0
      ? (budgetExecuted / budgetOccupied) * 100
      : 0;

    // 更新项目的budgetExecuted字段
    await project.update({ budgetExecuted });

    res.json({
      success: true,
      data: {
        ...project.toJSON(),
        budgetExecuted,
        remainingBudget,
        executionRate: parseFloat(executionRate.toFixed(2)),
        // 向后兼容
        executedAmount: budgetExecuted,
        remainingAmount: remainingBudget,
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
    const {
      category,
      projectName,
      subProjectName,
      owner,
      budgetAmount,
      content,
      // 新字段支持
      budgetOccupied,
      projectBackground,
      projectGoal,
      projectExplanation,
      projectType,
      projectStatus,
      members,
      procurementCode,
      completionStatus,
      relatedBudgetProject,
      budgetYear,
      orderAmount,
      acceptanceAmount,
      contractOrderNumber,
      expectedAcceptanceTime
    } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // 确定最终预算金额
    const finalBudgetAmount = parseFloat(budgetOccupied || budgetAmount || project.budgetOccupied);

    // 计算新的剩余预算 (原剩余预算 + 预算差额)
    const budgetDifference = finalBudgetAmount - parseFloat(project.budgetOccupied.toString());
    const newRemainingBudget = parseFloat(project.remainingBudget.toString()) + budgetDifference;

    const updateData: any = {
      category,
      projectName,
      subProjectName,
      owner,
      budgetAmount: finalBudgetAmount, // 向后兼容
      budgetOccupied: finalBudgetAmount, // 新字段
      remainingBudget: newRemainingBudget, // 更新剩余预算
      content: content || projectBackground || project.projectBackground,
      projectBackground: projectBackground || content || project.projectBackground,
      projectGoal: projectGoal || project.projectGoal,
      projectExplanation: projectExplanation || project.projectExplanation,
    };

    // 只更新提供的字段
    if (projectType !== undefined) updateData.projectType = projectType;
    if (projectStatus !== undefined) updateData.projectStatus = projectStatus;
    if (members !== undefined) updateData.members = members;
    if (procurementCode !== undefined) updateData.procurementCode = procurementCode;
    if (completionStatus !== undefined) updateData.completionStatus = completionStatus;
    if (relatedBudgetProject !== undefined) updateData.relatedBudgetProject = relatedBudgetProject;
    if (budgetYear !== undefined) updateData.budgetYear = budgetYear;
    if (orderAmount !== undefined) updateData.orderAmount = parseFloat(orderAmount);
    if (acceptanceAmount !== undefined) updateData.acceptanceAmount = parseFloat(acceptanceAmount);
    if (contractOrderNumber !== undefined) updateData.contractOrderNumber = contractOrderNumber;
    if (expectedAcceptanceTime !== undefined) updateData.expectedAcceptanceTime = new Date(expectedAcceptanceTime);

    await project.update(updateData);

    // 重新计算执行率等统计信息
    const executions = await BudgetExecution.findAll({ where: { projectId: id } });
    const budgetExecuted = executions.reduce((sum, exec) => sum + parseFloat(exec.executionAmount.toString()), 0);
    const executionRate = finalBudgetAmount > 0 ? (budgetExecuted / finalBudgetAmount) * 100 : 0;

    // 更新执行相关字段
    await project.update({
      budgetExecuted,
      remainingBudget: finalBudgetAmount - budgetExecuted
    });

    // 返回更新后的数据
    const updatedProject = await Project.findByPk(id);
    res.json({
      success: true,
      data: {
        ...updatedProject?.toJSON(),
        executionRate: parseFloat(executionRate.toFixed(2)),
        executedAmount: budgetExecuted, // 向后兼容
        remainingAmount: finalBudgetAmount - budgetExecuted, // 向后兼容
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    console.log('Delete project request received for ID:', req.params.id);
    console.log('User:', req.user);

    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      console.log('Project not found:', id);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    console.log('Deleting project:', project.projectName);

    // Delete all related records in order
    // 1. Delete budget executions
    console.log('Deleting budget executions...');
    await BudgetExecution.destroy({ where: { projectId: id } });

    // 2. Delete monthly execution plans
    console.log('Deleting monthly executions...');
    await MonthlyExecution.destroy({ where: { projectId: id } });

    // 3. Delete budget adjustments where this project is the original project
    console.log('Deleting budget adjustments...');
    await BudgetAdjustment.destroy({ where: { originalProjectId: id } });

    // 4. Delete project transfers
    console.log('Deleting project transfers...');
    await ProjectTransfer.destroy({ where: { projectId: id } });

    // 5. Finally delete the project itself
    console.log('Deleting project record...');
    await project.destroy();

    console.log('Project deleted successfully:', id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

// 批量导入项目预算数据
export const batchImportProjects = async (req: Request, res: Response) => {
  try {
    const { projects, budgetYear } = req.body;

    if (!Array.isArray(projects)) {
      return res.status(400).json({ success: false, message: '数据格式错误，请提供项目数组' });
    }

    const targetYear = budgetYear || new Date().getFullYear().toString();
    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const projectData of projects) {
      try {
        if (projectData.id) {
          // 更新现有项目
          const existingProject = await Project.findByPk(projectData.id);
          if (existingProject) {
            const budgetAmount = parseFloat(projectData.budgetAmount || projectData.budgetOccupied || existingProject.budgetOccupied);
            const executedAmount = parseFloat(projectData.executedAmount || projectData.budgetExecuted || 0);

            await existingProject.update({
              budgetOccupied: budgetAmount,
              budgetExecuted: executedAmount,
              budgetYear: projectData.budgetYear || targetYear,
              ...(projectData.projectName && { projectName: projectData.projectName }),
              ...(projectData.category && { category: projectData.category }),
              ...(projectData.owner && { owner: projectData.owner }),
            });
            results.updated++;
          } else {
            results.errors.push(`项目ID ${projectData.id} 不存在`);
          }
        } else if (projectData.projectCode) {
          // 根据projectCode查找并更新，或创建新项目
          const existingProject = await Project.findOne({ where: { projectCode: projectData.projectCode } });
          const budgetAmount = parseFloat(projectData.budgetAmount || projectData.budgetOccupied || 0);
          const executedAmount = parseFloat(projectData.executedAmount || projectData.budgetExecuted || 0);

          if (existingProject) {
            await existingProject.update({
              budgetOccupied: budgetAmount,
              budgetExecuted: executedAmount,
              budgetYear: projectData.budgetYear || targetYear,
              ...(projectData.projectName && { projectName: projectData.projectName }),
              ...(projectData.category && { category: projectData.category }),
              ...(projectData.owner && { owner: projectData.owner }),
            });
            results.updated++;
          } else {
            // 创建新项目
            await Project.create({
              projectCode: projectData.projectCode,
              projectName: projectData.projectName || '未命名项目',
              category: projectData.category || 'IDC架构研发',
              subProjectName: projectData.subProjectName || projectData.projectName || '未命名',
              projectType: projectData.projectType || '常规',
              projectStatus: projectData.projectStatus || '进行中',
              owner: projectData.owner || 'admin',
              members: projectData.members || '',
              projectGoal: projectData.projectGoal || '',
              projectBackground: projectData.projectBackground || '',
              projectExplanation: projectData.projectExplanation || '',
              procurementCode: projectData.procurementCode || projectData.projectCode,
              completionStatus: projectData.completionStatus || '未结项',
              relatedBudgetProject: projectData.relatedBudgetProject || '',
              budgetYear: projectData.budgetYear || targetYear,
              budgetOccupied: budgetAmount,
              budgetExecuted: executedAmount,
              orderAmount: parseFloat(projectData.orderAmount || 0),
              acceptanceAmount: parseFloat(projectData.acceptanceAmount || executedAmount),
              approvalStatus: projectData.approvalStatus || 'draft',
            } as any);
            results.created++;
          }
        } else {
          results.errors.push(`项目 "${projectData.projectName || '未知'}" 缺少id或projectCode`);
        }
      } catch (err: any) {
        results.errors.push(`处理项目 "${projectData.projectName || projectData.id || '未知'}" 时出错: ${err.message}`);
      }
    }

    res.json({
      success: true,
      data: results,
      message: `成功创建 ${results.created} 个项目，更新 ${results.updated} 个项目${results.errors.length > 0 ? `，${results.errors.length} 个错误` : ''}`,
    });
  } catch (error) {
    console.error('Batch import projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to batch import projects' });
  }
};