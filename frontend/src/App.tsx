import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

import AppLayout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PMDashboard from './pages/PMDashboard';
import ProjectList from './pages/ProjectList';
import ProjectCreate from './pages/ProjectCreate';
import ProjectView from './pages/ProjectView';
import ProjectEdit from './pages/ProjectEdit';
import ExecutionReport from './pages/ExecutionReport';
import ExecutionHistory from './pages/ExecutionHistory';
import StatisticsOverview from './pages/StatisticsOverview';
import StatisticsByCategory from './pages/StatisticsByCategory';
import StatisticsByOwner from './pages/StatisticsByOwner';
import BudgetAdjustment from './pages/BudgetAdjustment';
import BudgetManagement from './pages/BudgetManagement';
import GroupManagement from './pages/GroupManagement';
import ProjectTransfer from './pages/ProjectTransfer';

dayjs.locale('zh-cn');

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 登录页面 */}
          <Route path="/login" element={<Login />} />

          {/* 受保护的路由 */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* 普通员工和PM都能访问的路由 */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects/list" element={<ProjectList />} />
            <Route path="projects/create" element={<ProjectCreate />} />
            <Route path="projects/:id" element={<ProjectView />} />
            <Route path="projects/:id/edit" element={<ProjectEdit />} />
            <Route path="execution/report" element={<ExecutionReport />} />
            <Route path="execution/history" element={<ExecutionHistory />} />
            <Route path="statistics/overview" element={<StatisticsOverview />} />
            <Route path="statistics/by-category" element={<StatisticsByCategory />} />
            <Route path="statistics/by-owner" element={<StatisticsByOwner />} />
            <Route path="budget/adjustment" element={<BudgetAdjustment />} />
            <Route path="budget/management" element={<BudgetManagement />} />
            <Route path="groups" element={<GroupManagement />} />
            <Route path="project-transfers" element={<ProjectTransfer />} />

            {/* PM专用路由 */}
            <Route path="pm-dashboard" element={<PMDashboard />} />
          </Route>

          {/* 404重定向 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
