import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Project from './ProjectUpdated';

interface BudgetExecutionAttributes {
  id: number;
  projectId: number;
  executionAmount: number;
  executionDate: Date;
  executionStatus: string; // 执行情况：合同签订付款20%、方案设计60%、样机测试完成20%
  description: string;
  voucherUrl?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BudgetExecutionCreationAttributes extends Optional<BudgetExecutionAttributes, 'id'> {}

class BudgetExecution extends Model<BudgetExecutionAttributes, BudgetExecutionCreationAttributes> implements BudgetExecutionAttributes {
  public id!: number;
  public projectId!: number;
  public executionAmount!: number;
  public executionDate!: Date;
  public executionStatus!: string;
  public description!: string;
  public voucherUrl?: string;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BudgetExecution.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id',
    },
  },
  executionAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  executionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  executionStatus: {
    type: DataTypes.ENUM('合同签订付款20%', '方案设计60%', '样机测试完成20%'),
    allowNull: false,
    comment: '执行情况',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  voucherUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'BudgetExecution',
  tableName: 'budget_executions',
  timestamps: true,
});

// Associations are defined in models/index.ts

export default BudgetExecution;