"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Project_1 = __importDefault(require("./Project"));
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
            model: Project_1.default,
            key: 'id',
        },
    },
    executionAmount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    executionDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
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
BudgetExecution.belongsTo(Project_1.default, { foreignKey: 'projectId', as: 'project' });
Project_1.default.hasMany(BudgetExecution, { foreignKey: 'projectId', as: 'executions' });
exports.default = BudgetExecution;
//# sourceMappingURL=BudgetExecution.js.map