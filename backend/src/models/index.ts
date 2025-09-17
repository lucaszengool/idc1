import Project from './ProjectUpdated'; // 使用更新的项目模型
import BudgetExecution from './BudgetExecution';
import BudgetAdjustment from './BudgetAdjustment';
import MonthlyExecution from './MonthlyExecution';
import TotalBudget from './TotalBudget';
import User from './User';
import Group from './Group';
import GroupMember from './GroupMember';
import Approval from './Approval';
import ProjectTransfer from './ProjectTransfer';

// 定义关联关系
const defineAssociations = () => {
  // User 与 Project 的关联
  User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects' });
  Project.belongsTo(User, { foreignKey: 'ownerId', as: 'ownerUser' });

  // Group 与 Project 的关联
  Group.hasMany(Project, { foreignKey: 'groupId', as: 'projects' });
  Project.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

  // User 与 Group 的关联 (PM)
  User.hasMany(Group, { foreignKey: 'pmId', as: 'managedGroups' });
  Group.belongsTo(User, { foreignKey: 'pmId', as: 'pm' });

  // Group 与 GroupMember 的关联
  Group.hasMany(GroupMember, { foreignKey: 'groupId', as: 'members' });
  GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

  // User 与 GroupMember 的关联
  User.hasMany(GroupMember, { foreignKey: 'userId', as: 'groupMemberships' });
  GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Approval 关联
  User.hasMany(Approval, { foreignKey: 'requesterId', as: 'submittedApprovals' });
  User.hasMany(Approval, { foreignKey: 'approverId', as: 'reviewedApprovals' });
  Approval.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
  Approval.belongsTo(User, { foreignKey: 'approverId', as: 'approver' });
  Group.hasMany(Approval, { foreignKey: 'groupId', as: 'approvals' });
  Approval.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

  // ProjectTransfer 关联
  Project.hasMany(ProjectTransfer, { foreignKey: 'projectId', as: 'transfers' });
  ProjectTransfer.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

  // BudgetExecution 关联
  Project.hasMany(BudgetExecution, { foreignKey: 'projectId', as: 'executions' });
  BudgetExecution.belongsTo(Project, { foreignKey: 'projectId', as: 'executionProject' });

  // MonthlyExecution 关联
  Project.hasMany(MonthlyExecution, { foreignKey: 'projectId', as: 'monthlyExecutions' });
  MonthlyExecution.belongsTo(Project, { foreignKey: 'projectId', as: 'monthlyProject' });

  // BudgetAdjustment 关联
  Project.hasMany(BudgetAdjustment, { foreignKey: 'originalProjectId', as: 'adjustments' });
  BudgetAdjustment.belongsTo(Project, { foreignKey: 'originalProjectId', as: 'originalProject' });
};

export {
  Project,
  BudgetExecution,
  BudgetAdjustment,
  MonthlyExecution,
  TotalBudget,
  User,
  Group,
  GroupMember,
  Approval,
  ProjectTransfer,
  defineAssociations,
};