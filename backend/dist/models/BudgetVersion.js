"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class BudgetVersion extends sequelize_1.Model {
}
BudgetVersion.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    versionName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '版本名称',
    },
    budgetYear: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '预算年份',
    },
    fileUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '文件URL',
    },
    fileName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '文件名',
    },
    fileType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '文件类型',
    },
    uploadedBy: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '上传人',
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '版本描述',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: '是否为当前激活版本',
    },
    totalBudget: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: '该版本的总预算',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: 'budget_versions',
    timestamps: true,
});
exports.default = BudgetVersion;
//# sourceMappingURL=BudgetVersion.js.map