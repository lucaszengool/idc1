"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Project extends sequelize_1.Model {
}
Project.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projectCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '项目编号',
    },
    projectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '项目名称',
    },
    projectType: {
        type: sequelize_1.DataTypes.ENUM('重点', '常规'),
        allowNull: false,
        comment: '项目类型',
    },
    projectStatus: {
        type: sequelize_1.DataTypes.ENUM('完成', '进行中', '待开始'),
        allowNull: false,
        comment: '立项状态',
    },
    owner: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '负责人',
    },
    members: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
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
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '服采立项单号',
    },
    completionStatus: {
        type: sequelize_1.DataTypes.ENUM('未结项', '已结项'),
        allowNull: false,
        defaultValue: '未结项',
        comment: '结项状态',
    },
    relatedBudgetProject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '关联预算项目名称',
    },
    budgetYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: '预算区间',
    },
    budgetOccupied: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: '预算占用(B) - 固定总预算',
    },
    budgetExecuted: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
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
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: true,
        defaultValue: 0,
        comment: '订单金额',
    },
    acceptanceAmount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: true,
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
    // 保持向后兼容的字段
    category: {
        type: sequelize_1.DataTypes.ENUM('IDC-架构研发', '高校合作', 'IDC运营-研发'),
        allowNull: true,
    },
    subProjectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    budgetAmount: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.budgetOccupied; // 向后兼容，实际使用budgetOccupied
        },
    },
    content: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.projectBackground; // 向后兼容，实际使用projectBackground
        },
    },
}, {
    sequelize: database_1.default,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
});
exports.default = Project;
//# sourceMappingURL=Project.js.map