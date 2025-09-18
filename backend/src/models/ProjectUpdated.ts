import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ProjectAttributes {
  id: number;
  projectCode: string; // 项目编号
  projectName: string; // 项目名称
  projectType: string; // 项目类型
  projectStatus: string; // 立项状态
  owner: string; // 负责人
  ownerId?: number; // 负责人用户ID
  groupId?: number; // 所属组ID
  members: string; // 项目成员
  projectGoal: string; // 项目目标
  projectBackground: string; // 项目背景
  projectExplanation: string; // 推导说明
  procurementCode: string; // 服采立项单号
  completionStatus: string; // 结项状态
  relatedBudgetProject: string; // 关联预算项目名称
  budgetYear: string; // 预算区间
  budgetOccupied: number; // 预算占用(B) - 固定总预算
  budgetExecuted: number; // 预算执行(C) - 已执行金额
  remainingBudget: number; // 立项剩余(B-C)
  orderAmount: number; // 订单金额
  acceptanceAmount: number; // 验收金额(D1)
  contractOrderNumber?: string; // 合同/订单号
  expectedAcceptanceTime?: Date; // 预计验收时间

  // 月度执行计划字段 (从Excel中看到的字段)
  septemberActualExecution?: string; // 项目9月实际执行情况
  octoberPlan?: string; // 10月计划执行
  novemberPlan?: string; // 11月计划执行
  decemberPlan?: string; // 12月计划执行

  // 实际执行金额
  septemberActual?: number;
  octoberActual?: number;
  novemberActual?: number;
  decemberActual?: number;

  // 风险等级和优先级
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  // 审核相关字段
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedBy?: number;
  approvedBy?: number;
  approvedAt?: Date;
  rejectionReason?: string;

  // 向后兼容字段
  category?: string;
  subProjectName?: string;
  budgetAmount?: number; // 虚拟字段，映射到budgetOccupied
  content?: string; // 虚拟字段，映射到projectBackground

  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCreationAttributes extends Optional<ProjectAttributes,
  'id' | 'ownerId' | 'groupId' | 'contractOrderNumber' | 'expectedAcceptanceTime' |
  'septemberActualExecution' | 'octoberPlan' | 'novemberPlan' | 'decemberPlan' |
  'septemberActual' | 'octoberActual' | 'novemberActual' | 'decemberActual' |
  'riskLevel' | 'priority' | 'submittedBy' | 'approvedBy' | 'approvedAt' | 'rejectionReason' |
  'category' | 'subProjectName' | 'budgetAmount' | 'content' | 'createdAt' | 'updatedAt'
> {}

export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public projectCode!: string;
  public projectName!: string;
  public projectType!: string;
  public projectStatus!: string;
  public owner!: string;
  public ownerId?: number;
  public groupId?: number;
  public members!: string;
  public projectGoal!: string;
  public projectBackground!: string;
  public projectExplanation!: string;
  public procurementCode!: string;
  public completionStatus!: string;
  public relatedBudgetProject!: string;
  public budgetYear!: string;
  public budgetOccupied!: number;
  public budgetExecuted!: number;
  public remainingBudget!: number;
  public orderAmount!: number;
  public acceptanceAmount!: number;
  public contractOrderNumber?: string;
  public expectedAcceptanceTime?: Date;

  // 月度执行计划
  public septemberActualExecution?: string;
  public octoberPlan?: string;
  public novemberPlan?: string;
  public decemberPlan?: string;

  // 实际执行金额
  public septemberActual?: number;
  public octoberActual?: number;
  public novemberActual?: number;
  public decemberActual?: number;

  // 风险等级和优先级
  public riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  public priority?: 'low' | 'medium' | 'high' | 'urgent';

  // 审核相关
  public approvalStatus!: 'draft' | 'pending' | 'approved' | 'rejected';
  public submittedBy?: number;
  public approvedBy?: number;
  public approvedAt?: Date;
  public rejectionReason?: string;

  // 向后兼容字段
  public category?: string;
  public subProjectName?: string;
  public budgetAmount?: number;
  public content?: string;

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
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '项目编号',
  },
  projectName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '项目名称',
  },
  projectType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '项目类型',
  },
  projectStatus: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '立项状态',
  },
  owner: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '负责人',
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: '负责人用户ID',
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'groups',
      key: 'id',
    },
    comment: '所属组ID',
  },
  members: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
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
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '服采立项单号',
  },
  completionStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '未结项',
    comment: '结项状态',
  },
  relatedBudgetProject: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '关联预算项目名称',
  },
  budgetYear: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: '预算区间',
  },
  budgetOccupied: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: '预算占用(B) - 固定总预算',
  },
  budgetExecuted: {
    type: DataTypes.DECIMAL(15, 2),
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
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: '订单金额',
  },
  acceptanceAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
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

  // 月度执行计划
  septemberActualExecution: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '项目9月实际执行情况',
  },
  octoberPlan: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '10月计划执行',
  },
  novemberPlan: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '11月计划执行',
  },
  decemberPlan: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '12月计划执行',
  },

  // 实际执行金额
  septemberActual: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: '9月实际执行金额',
  },
  octoberActual: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: '10月实际执行金额',
  },
  novemberActual: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: '11月实际执行金额',
  },
  decemberActual: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: '12月实际执行金额',
  },

  // 风险等级和优先级
  riskLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: true,
    comment: '风险等级',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: true,
    comment: '项目优先级',
  },

  // 审核相关字段
  approvalStatus: {
    type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'draft',
    comment: '审核状态',
  },
  submittedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: '提交人ID',
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: '审核人ID',
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '审核时间',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '拒绝理由',
  },

  // 向后兼容字段
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  subProjectName: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  budgetAmount: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.budgetOccupied;
    },
  },
  content: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.projectBackground;
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectCode']
    },
    {
      fields: ['approvalStatus']
    },
    {
      fields: ['ownerId']
    },
    {
      fields: ['groupId']
    },
    {
      fields: ['budgetYear']
    },
    {
      fields: ['projectType']
    }
  ]
});

export default Project;