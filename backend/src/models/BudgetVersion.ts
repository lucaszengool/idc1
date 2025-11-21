import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface BudgetVersionAttributes {
  id: number;
  versionName: string; // 版本名称，如 "2026年第1版"
  budgetYear: string; // 预算年份
  fileUrl: string; // 上传的PPT/图片文件URL
  fileName: string; // 文件名
  fileType: string; // 文件类型 (ppt, pptx, pdf, jpg, png)
  uploadedBy: string; // 上传人（杨雯宇）
  description?: string; // 版本描述
  isActive: boolean; // 是否为当前激活版本
  totalBudget?: number; // 该版本的总预算
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetVersionCreationAttributes extends Optional<BudgetVersionAttributes,
  'id' | 'description' | 'totalBudget' | 'createdAt' | 'updatedAt'
> {}

class BudgetVersion extends Model<BudgetVersionAttributes, BudgetVersionCreationAttributes> implements BudgetVersionAttributes {
  public id!: number;
  public versionName!: string;
  public budgetYear!: string;
  public fileUrl!: string;
  public fileName!: string;
  public fileType!: string;
  public uploadedBy!: string;
  public description?: string;
  public isActive!: boolean;
  public totalBudget?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BudgetVersion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    versionName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '版本名称',
    },
    budgetYear: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '预算年份',
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '文件URL',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '文件名',
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '文件类型',
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '上传人',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '版本描述',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '是否为当前激活版本',
    },
    totalBudget: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: '该版本的总预算',
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
    tableName: 'budget_versions',
    timestamps: true,
  }
);

export default BudgetVersion;
