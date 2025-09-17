"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Approval = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Approval extends sequelize_1.Model {
}
exports.Approval = Approval;
Approval.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    requestType: {
        type: sequelize_1.DataTypes.ENUM('project_create', 'project_update', 'project_transfer', 'execution_create', 'execution_update', 'budget_adjustment'),
        allowNull: false,
    },
    requestData: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    requesterId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    approverId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    groupId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'groups',
            key: 'id',
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    reviewNotes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    submittedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    reviewedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
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
    tableName: 'approvals',
    timestamps: true,
    indexes: [
        {
            fields: ['status']
        },
        {
            fields: ['approverId']
        },
        {
            fields: ['requesterId']
        },
        {
            fields: ['groupId']
        }
    ]
});
exports.default = Approval;
//# sourceMappingURL=Approval.js.map