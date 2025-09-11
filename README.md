# DCOPS 预算管理系统

IDC数据中心运营预算管理系统，用于管理项目预算、执行情况跟踪和数据统计分析。

## 项目结构

```
dcops-budget-system/
├── frontend/          # React前端应用
├── backend/           # Node.js后端API
└── README.md
```

## 功能特性

- 📊 项目预算管理
- 📈 预算执行跟踪
- 📋 执行历史记录
- 📊 多维度统计分析
- 🎯 分类统计
- 👤 负责人统计
- 📱 响应式界面设计

## 技术栈

### 前端
- React 19
- TypeScript
- Ant Design
- Recharts (数据可视化)
- React Router

### 后端
- Node.js
- Express
- TypeScript
- Sequelize ORM
- PostgreSQL
- JWT认证

## 快速开始

### 环境要求
- Node.js 16+
- PostgreSQL 13+

### 后端设置
```bash
cd backend
npm install
npm run build
npm start
```

后端服务运行在: http://localhost:3001

### 前端设置
```bash
cd frontend
npm install
npm start
```

前端应用运行在: http://localhost:3000

## 主要页面

1. **项目管理** - 创建、编辑、删除项目
2. **执行记录** - 预算执行历史和凭证管理
3. **统计总览** - 整体预算统计和可视化
4. **分类统计** - 按项目分类的详细统计
5. **负责人统计** - 按负责人维度的统计分析

## 开发团队

IDC数据中心运营团队

## 许可证

私有项目