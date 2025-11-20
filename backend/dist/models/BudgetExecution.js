"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ProjectUpdated_1 = __importDefault(require("./ProjectUpdated"));
class BudgetExecution extends sequelize_1.Model {
}
BudgetExecution.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    projectId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProjectUpdated_1.default,
            key: 'id',
        },
    },
    executionAmount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    executionStatus: {
        type: sequelize_1.DataTypes.ENUM('合同签订付款20%', '方案设计60%', '样机测试完成20%'),
        allowNull: false,
        comment: '执行情况',
    },
    voucherUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    createdBy: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'BudgetExecution',
    tableName: 'budget_executions',
    timestamps: true,
});
// Associations are defined in models/index.ts
exports.default = BudgetExecution;
//# sourceMappingURL=BudgetExecution.js.map