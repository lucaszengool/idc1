"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const ProjectUpdated_1 = __importDefault(require("./ProjectUpdated"));
class MonthlyExecution extends sequelize_1.Model {
}
MonthlyExecution.init({
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
        comment: '项目ID',
    },
    year: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: '年份',
    },
    month: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 12,
        },
        comment: '月份',
    },
    planDescription: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: '月度计划执行描述',
    },
    actualDescription: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: '实际执行情况描述',
    },
    isCompleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否完成',
    },
}, {
    sequelize: database_1.default,
    modelName: 'MonthlyExecution',
    tableName: 'monthly_executions',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['projectId', 'year', 'month'],
        },
    ],
});
// Associations are defined in models/index.ts
exports.default = MonthlyExecution;
//# sourceMappingURL=MonthlyExecution.js.map