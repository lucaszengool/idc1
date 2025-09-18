"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Project extends sequelize_1.Model {
}
exports.Project = Project;
Project.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projectCode: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        comment: '项目编号',
    },
    projectName: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
        comment: '项目名称',
    },
    projectType: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        comment: '项目类型',
    },
    projectStatus: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        comment: '立项状态',
    },
    owner: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        comment: '负责人',
    },
    ownerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        comment: '负责人用户ID',
    },
    groupId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'groups',
            key: 'id',
        },
        comment: '所属组ID',
    },
    members: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '项目成员',
    },
    projectGoal: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: '项目目标',
    },
    projectBackground: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: '项目背景',
    },
    projectExplanation: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: '推导说明',
    },
    procurementCode: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        comment: '服采立项单号',
    },
    completionStatus: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '未结项',
        comment: '结项状态',
    },
    relatedBudgetProject: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
        comment: '关联预算项目名称',
    },
    budgetYear: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        comment: '预算区间',
    },
    budgetOccupied: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: '预算占用(B) - 固定总预算',
    },
    budgetExecuted: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '预算执行(C) - 已执行金额',
    },
    remainingBudget: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.budgetOccupied - this.budgetExecuted;
        },
        comment: '立项剩余(B-C) - 自动计算',
    },
    orderAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '订单金额',
    },
    acceptanceAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '验收金额(D1)',
    },
    contractOrderNumber: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '合同/订单号',
    },
    expectedAcceptanceTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: '预计验收时间',
    },
    // 月度执行计划
    septemberActualExecution: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '项目9月实际执行情况',
    },
    octoberPlan: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '10月计划执行',
    },
    novemberPlan: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '11月计划执行',
    },
    decemberPlan: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '12月计划执行',
    },
    // 实际执行金额
    septemberActual: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: '9月实际执行金额',
    },
    octoberActual: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: '10月实际执行金额',
    },
    novemberActual: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: '11月实际执行金额',
    },
    decemberActual: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: '12月实际执行金额',
    },
    // 风险等级和优先级
    riskLevel: {
        type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: true,
        comment: '风险等级',
    },
    priority: {
        type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: true,
        comment: '项目优先级',
    },
    // 审核相关字段
    approvalStatus: {
        type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: '审核状态',
    },
    submittedBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        comment: '提交人ID',
    },
    approvedBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        comment: '审核人ID',
    },
    approvedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: '审核时间',
    },
    rejectionReason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '拒绝理由',
    },
    // 向后兼容字段
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    subProjectName: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
    budgetAmount: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.budgetOccupied;
        },
    },
    content: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.projectBackground;
        },
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['projectCode']
        },
        {
            fields: ['approvalStatus']
        },
        {
            fields: ['ownerId']
        },
        {
            fields: ['groupId']
        },
        {
            fields: ['budgetYear']
        },
        {
            fields: ['projectType']
        }
    ]
});
exports.default = Project;
//# sourceMappingURL=ProjectUpdated.js.map