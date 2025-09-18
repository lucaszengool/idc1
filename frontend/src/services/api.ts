import axios from 'axios';
import { Project, BudgetExecution, BudgetAdjustment, DashboardStats, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Project APIs
export const projectAPI = {
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Project>>('/projects', data),
  
  getAll: (params?: { category?: string; owner?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ projects: Project[]; totalCount: number; currentPage: number; totalPages: number }>>('/projects', { params }),
  
  getById: (id: number) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`),
  
  update: (id: number, data: Partial<Project>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/projects/${id}`),
};

// Budget Execution APIs
export const executionAPI = {
  create: (data: FormData) =>
    api.post<ApiResponse<BudgetExecution>>('/executions', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getAll: (params?: { projectId?: number; startDate?: string; endDate?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ executions: BudgetExecution[]; totalCount: number; currentPage: number; totalPages: number }>>('/executions', { params }),
  
  getByProject: (projectId: number) =>
    api.get<ApiResponse<{ executions: BudgetExecution[]; totalExecuted: number }>>(`/executions/project/${projectId}`),
  
  update: (id: number, data: Partial<BudgetExecution>) =>
    api.put<ApiResponse<BudgetExecution>>(`/executions/${id}`, data),
  
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/executions/${id}`),
};

// Statistics APIs
export const statisticsAPI = {
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/statistics/dashboard'),
  
  getByCategory: () =>
    api.get<ApiResponse<any[]>>('/statistics/by-category'),
  
  getByOwner: () =>
    api.get<ApiResponse<any[]>>('/statistics/by-owner'),
  
  getTotal: () =>
    api.get<ApiResponse<any>>('/statistics/total'),
};

// Budget Adjustment APIs
export const adjustmentAPI = {
  create: (data: Omit<BudgetAdjustment, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<BudgetAdjustment>>('/adjustments', data),

  getAll: (params?: { originalProjectId?: number; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ adjustments: BudgetAdjustment[]; totalCount: number; currentPage: number; totalPages: number }>>('/adjustments', { params }),
};

// Total Budget APIs
export const totalBudgetAPI = {
  get: (year?: string) =>
    api.get<ApiResponse<{ id: number; budgetYear: string; totalAmount: number }>>('/total-budget', { params: { year } }),

  update: (year: string, totalAmount: number) =>
    api.post<ApiResponse<{ id: number; budgetYear: string; totalAmount: number }>>('/total-budget', {
      budgetYear: year,
      totalAmount
    }),
};

export default api;