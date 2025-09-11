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
    category: {
        type: sequelize_1.DataTypes.ENUM('IDC-架构研发', '高校合作', 'IDC运营-研发'),
        allowNull: false,
    },
    projectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subProjectName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    owner: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    budgetAmount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
});
exports.default = Project;
//# sourceMappingURL=Project.js.map