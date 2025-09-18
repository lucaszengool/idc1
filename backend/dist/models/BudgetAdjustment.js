"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ProjectUpdated_1 = __importDefault(require("./ProjectUpdated"));
class BudgetAdjustment extends sequelize_1.Model {
}
BudgetAdjustment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    originalProjectId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProjectUpdated_1.default,
            key: 'id',
        },
    },
    newProjectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    adjustmentReason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    adjustmentAmount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    targetCategory: {
        type: sequelize_1.DataTypes.ENUM('IDC-架构研发', '高校合作', 'IDC运营-研发'),
        allowNull: false,
    },
    targetProject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    targetSubProject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    targetOwner: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'BudgetAdjustment',
    tableName: 'budget_adjustments',
    timestamps: true,
});
exports.default = BudgetAdjustment;
//# sourceMappingURL=BudgetAdjustment.js.map