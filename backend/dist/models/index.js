"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineAssociations = exports.BudgetVersion = exports.ProjectTransfer = exports.Approval = exports.GroupMember = exports.Group = exports.User = exports.TotalBudget = exports.MonthlyExecution = exports.BudgetAdjustment = exports.BudgetExecution = exports.Project = void 0;
const ProjectUpdated_1 = __importDefault(require("./ProjectUpdated")); // 使用更新的项目模型
exports.Project = ProjectUpdated_1.default;
const BudgetExecution_1 = __importDefault(require("./BudgetExecution"));
exports.BudgetExecution = BudgetExecution_1.default;
const BudgetAdjustment_1 = __importDefault(require("./BudgetAdjustment"));
exports.BudgetAdjustment = BudgetAdjustment_1.default;
const MonthlyExecution_1 = __importDefault(require("./MonthlyExecution"));
exports.MonthlyExecution = MonthlyExecution_1.default;
const TotalBudget_1 = __importDefault(require("./TotalBudget"));
exports.TotalBudget = TotalBudget_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Group_1 = __importDefault(require("./Group"));
exports.Group = Group_1.default;
const GroupMember_1 = __importDefault(require("./GroupMember"));
exports.GroupMember = GroupMember_1.default;
const Approval_1 = __importDefault(require("./Approval"));
exports.Approval = Approval_1.default;
const ProjectTransfer_1 = __importDefault(require("./ProjectTransfer"));
exports.ProjectTransfer = ProjectTransfer_1.default;
const BudgetVersion_1 = __importDefault(require("./BudgetVersion"));
exports.BudgetVersion = BudgetVersion_1.default;
// 定义关联关系
const defineAssociations = () => {
    // User 与 Project 的关联
    User_1.default.hasMany(ProjectUpdated_1.default, { foreignKey: 'ownerId', as: 'ownedProjects' });
    ProjectUpdated_1.default.belongsTo(User_1.default, { foreignKey: 'ownerId', as: 'ownerUser' });
    // Group 与 Project 的关联
    Group_1.default.hasMany(ProjectUpdated_1.default, { foreignKey: 'groupId', as: 'projects' });
    ProjectUpdated_1.default.belongsTo(Group_1.default, { foreignKey: 'groupId', as: 'group' });
    // User 与 Group 的关联 (PM)
    User_1.default.hasMany(Group_1.default, { foreignKey: 'pmId', as: 'managedGroups' });
    Group_1.default.belongsTo(User_1.default, { foreignKey: 'pmId', as: 'pm' });
    // Group 与 GroupMember 的关联
    Group_1.default.hasMany(GroupMember_1.default, { foreignKey: 'groupId', as: 'members' });
    GroupMember_1.default.belongsTo(Group_1.default, { foreignKey: 'groupId', as: 'group' });
    // User 与 GroupMember 的关联
    User_1.default.hasMany(GroupMember_1.default, { foreignKey: 'userId', as: 'groupMemberships' });
    GroupMember_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' });
    // Approval 关联
    User_1.default.hasMany(Approval_1.default, { foreignKey: 'requesterId', as: 'submittedApprovals' });
    User_1.default.hasMany(Approval_1.default, { foreignKey: 'approverId', as: 'reviewedApprovals' });
    Approval_1.default.belongsTo(User_1.default, { foreignKey: 'requesterId', as: 'requester' });
    Approval_1.default.belongsTo(User_1.default, { foreignKey: 'approverId', as: 'approver' });
    Group_1.default.hasMany(Approval_1.default, { foreignKey: 'groupId', as: 'approvals' });
    Approval_1.default.belongsTo(Group_1.default, { foreignKey: 'groupId', as: 'group' });
    // ProjectTransfer 关联
    ProjectUpdated_1.default.hasMany(ProjectTransfer_1.default, { foreignKey: 'projectId', as: 'transfers' });
    ProjectTransfer_1.default.belongsTo(ProjectUpdated_1.default, { foreignKey: 'projectId', as: 'project' });
    // BudgetExecution 关联
    ProjectUpdated_1.default.hasMany(BudgetExecution_1.default, { foreignKey: 'projectId', as: 'executions' });
    BudgetExecution_1.default.belongsTo(ProjectUpdated_1.default, { foreignKey: 'projectId', as: 'executionProject' });
    // MonthlyExecution 关联
    ProjectUpdated_1.default.hasMany(MonthlyExecution_1.default, { foreignKey: 'projectId', as: 'monthlyExecutions' });
    MonthlyExecution_1.default.belongsTo(ProjectUpdated_1.default, { foreignKey: 'projectId', as: 'monthlyProject' });
    // BudgetAdjustment 关联
    ProjectUpdated_1.default.hasMany(BudgetAdjustment_1.default, { foreignKey: 'originalProjectId', as: 'adjustments' });
    BudgetAdjustment_1.default.belongsTo(ProjectUpdated_1.default, { foreignKey: 'originalProjectId', as: 'originalProject' });
};
exports.defineAssociations = defineAssociations;
//# sourceMappingURL=index.js.map