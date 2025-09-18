import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Project from './ProjectUpdated';

interface MonthlyExecutionAttributes {
  id: number;
  projectId: number;
  year: number;
  month: number;
  planDescription: string; // 月度计划执行
  actualDescription: string; // 实际执行情况
  isCompleted: boolean; // 是否完成
  createdAt?: Date;
  updatedAt?: Date;
}

interface MonthlyExecutionCreationAttributes extends Optional<MonthlyExecutionAttributes, 'id'> {}

class MonthlyExecution extends Model<MonthlyExecutionAttributes, MonthlyExecutionCreationAttributes> implements MonthlyExecutionAttributes {
  public id!: number;
  public projectId!: number;
  public year!: number;
  public month!: number;
  public planDescription!: string;
  public actualDescription!: string;
  public isCompleted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MonthlyExecution.init({
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
    comment: '项目ID',
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '年份',
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12,
    },
    comment: '月份',
  },
  planDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '月度计划执行描述',
  },
  actualDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '实际执行情况描述',
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否完成',
  },
}, {
  sequelize,
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

export default MonthlyExecution;