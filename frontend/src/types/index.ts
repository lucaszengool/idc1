export interface Project {
  id: number;
  // 新字段
  projectCode: string; // 项目编号
  projectName: string; // 项目名称
  projectType: string; // 项目类型
  projectStatus: string; // 立项状态
  owner: string; // 负责人
  members?: string; // 项目成员
  projectGoal: string; // 项目目标
  projectBackground: string; // 项目背景
  projectExplanation: string; // 推导说明
  procurementCode: string; // 服采立项单号
  completionStatus: string; // 结项状态
  relatedBudgetProject: string; // 关联预算项目名称
  budgetYear: number; // 预算区间
  budgetOccupied: number; // 预算占用(B) - 固定总预算
  budgetExecuted: number; // 预算执行(C) - 已执行金额
  remainingBudget: number; // 立项剩余(B-C)
  orderAmount?: number; // 订单金额
  acceptanceAmount?: number; // 验收金额(D1)
  contractOrderNumber?: string; // 合同/订单号
  expectedAcceptanceTime?: string; // 预计验收时间
  createdAt: string;
  updatedAt: string;

  // 计算字段
  executionRate?: number;

  // 向后兼容字段
  category?: string;
  subProjectName?: string;
  budgetAmount?: number; // 实际使用budgetOccupied
  content?: string; // 实际使用projectBackground
  executedAmount?: number; // 兼容字段，实际使用budgetExecuted
  remainingAmount?: number; // 兼容字段，实际使用remainingBudget
}

export interface BudgetExecution {
  id: number;
  projectId: number;
  executionAmount: number;
  executionDate: string;
  executionStatus: string; // 执行情况：合同签订付款20%、方案设计60%、样机测试完成20%
  description: string;
  voucherUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
}

export interface MonthlyExecution {
  id: number;
  projectId: number;
  year: number;
  month: number;
  planDescription: string; // 月度计划执行
  actualDescription?: string; // 实际执行情况
  isCompleted: boolean; // 是否完成
  createdAt: string;
  updatedAt: string;
  project?: Project;
}

export interface BudgetAdjustment {
  id: number;
  originalProjectId: number;
  newProjectName: string;
  adjustmentReason: string;
  adjustmentAmount: number;
  targetCategory: string;
  targetProject: string;
  targetSubProject: string;
  targetOwner: string;
  createdAt: string;
  updatedAt: string;
  originalProject?: Project;
}

export interface DashboardStats {
  总预算: number;
  已执行金额: number;
  剩余预算: number;
  预算执行率: number;
  预计执行金额: number;
  预计剩余预算: number;
  项目总数: number;
  categoryStats: Array<{
    category: string;
    projectCount: number;
    totalBudget: number;
    executedAmount: number; // Add executed amount from execution data
  }>;
  recentExecutions: BudgetExecution[];
  highRiskProjects: Array<{
    id: number;
    projectName: string;
    budgetAmount: number;
    executedAmount: number;
    executionRate: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}