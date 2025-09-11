import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Project from './Project';

interface BudgetAdjustmentAttributes {
  id: number;
  originalProjectId: number;
  newProjectName: string;
  adjustmentReason: string;
  adjustmentAmount: number;
  targetCategory: string;
  targetProject: string;
  targetSubProject: string;
  targetOwner: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BudgetAdjustmentCreationAttributes extends Optional<BudgetAdjustmentAttributes, 'id'> {}

class BudgetAdjustment extends Model<BudgetAdjustmentAttributes, BudgetAdjustmentCreationAttributes> implements BudgetAdjustmentAttributes {
  public id!: number;
  public originalProjectId!: number;
  public newProjectName!: string;
  public adjustmentReason!: string;
  public adjustmentAmount!: number;
  public targetCategory!: string;
  public targetProject!: string;
  public targetSubProject!: string;
  public targetOwner!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BudgetAdjustment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  originalProjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id',
    },
  },
  newProjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adjustmentReason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  adjustmentAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  targetCategory: {
    type: DataTypes.ENUM('IDC-架构研发', '高校合作', 'IDC运营-研发'),
    allowNull: false,
  },
  targetProject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetSubProject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetOwner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'BudgetAdjustment',
  tableName: 'budget_adjustments',
  timestamps: true,
});

BudgetAdjustment.belongsTo(Project, { foreignKey: 'originalProjectId', as: 'originalProject' });

export default BudgetAdjustment;