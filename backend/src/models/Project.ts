import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProjectAttributes {
  id: number;
  projectCode: string; // 项目编号
  projectName: string; // 项目名称
  projectType: string; // 项目类型
  projectStatus: string; // 立项状态
  owner: string; // 负责人
  members: string; // 项目成员
  projectGoal: string; // 项目目标
  projectBackground: string; // 项目背景
  projectExplanation: string; // 推导说明
  procurementCode: string; // 服采立项单号
  completionStatus: string; // 结项状态
  relatedBudgetProject: string; // 关联预算项目名称
  budgetYear: number; // 预算区间
  budgetOccupied: number; // 预算占用(B) - 这是固定的总预算
  budgetExecuted: number; // 预算执行(C) - 已执行金额
  remainingBudget: number; // 立项剩余(B-C)
  orderAmount: number; // 订单金额
  acceptanceAmount: number; // 验收金额(D1)
  contractOrderNumber: string; // 合同/订单号
  expectedAcceptanceTime?: Date; // 预计验收时间
  category: string; // 保持向后兼容
  subProjectName: string; // 保持向后兼容
  budgetAmount: number; // 保持向后兼容，实际使用budgetOccupied
  content: string; // 保持向后兼容，实际使用projectBackground
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'createdAt' | 'updatedAt' | 'remainingBudget' | 'budgetAmount' | 'content' | 'expectedAcceptanceTime'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public projectCode!: string;
  public projectName!: string;
  public projectType!: string;
  public projectStatus!: string;
  public owner!: string;
  public members!: string;
  public projectGoal!: string;
  public projectBackground!: string;
  public projectExplanation!: string;
  public procurementCode!: string;
  public completionStatus!: string;
  public relatedBudgetProject!: string;
  public budgetYear!: number;
  public budgetOccupied!: number;
  public budgetExecuted!: number;
  public remainingBudget!: number;
  public orderAmount!: number;
  public acceptanceAmount!: number;
  public contractOrderNumber!: string;
  public expectedAcceptanceTime?: Date;
  // 保持向后兼容字段
  public category!: string;
  public subProjectName!: string;
  public budgetAmount!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '项目编号',
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '项目名称',
  },
  projectType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '项目类型',
  },
  projectStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '立项状态',
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '负责人',
  },
  members: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '项目成员',
  },
  projectGoal: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '项目目标',
  },
  projectBackground: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '项目背景',
  },
  projectExplanation: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '推导说明',
  },
  procurementCode: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '服采立项单号',
  },
  completionStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '未结项',
    comment: '结项状态',
  },
  relatedBudgetProject: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '关联预算项目名称',
  },
  budgetYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '预算区间',
  },
  budgetOccupied: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: '预算占用(B) - 固定总预算',
  },
  budgetExecuted: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '预算执行(C) - 已执行金额',
  },
  remainingBudget: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.budgetOccupied - this.budgetExecuted;
    },
    comment: '立项剩余(B-C) - 自动计算',
  },
  orderAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: '订单金额',
  },
  acceptanceAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
    comment: '验收金额(D1)',
  },
  contractOrderNumber: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '合同/订单号',
  },
  expectedAcceptanceTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '预计验收时间',
  },
  // 保持向后兼容的字段
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subProjectName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  budgetAmount: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.budgetOccupied; // 向后兼容，实际使用budgetOccupied
    },
  },
  content: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.projectBackground; // 向后兼容，实际使用projectBackground
    },
  },
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects',
  timestamps: true,
});

export default Project;