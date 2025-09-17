"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalBudget = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class TotalBudget extends sequelize_1.Model {
}
exports.TotalBudget = TotalBudget;
TotalBudget.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    budgetYear: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    createdBy: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Admin',
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
    tableName: 'total_budgets',
    timestamps: true,
});
exports.default = TotalBudget;
//# sourceMappingURL=TotalBudget.js.map