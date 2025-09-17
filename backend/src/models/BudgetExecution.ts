import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Project from './Project';

interface BudgetExecutionAttributes {
  id: number;
  projectId: number;
  executionAmount: number;
  executionDate: Date;
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

BudgetExecution.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Project.hasMany(BudgetExecution, { foreignKey: 'projectId', as: 'executions', onDelete: 'CASCADE' });

export default BudgetExecution;