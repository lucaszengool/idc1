import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TotalBudgetAttributes {
  id: number;
  budgetYear: string;
  totalAmount: number;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TotalBudgetCreationAttributes
  extends Optional<TotalBudgetAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

export class TotalBudget extends Model<TotalBudgetAttributes, TotalBudgetCreationAttributes>
  implements TotalBudgetAttributes {
  public id!: number;
  public budgetYear!: string;
  public totalAmount!: number;
  public description?: string;
  public createdBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TotalBudget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    budgetYear: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Admin',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'total_budgets',
    timestamps: true,
  }
);

export default TotalBudget;