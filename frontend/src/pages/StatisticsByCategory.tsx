import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectAPI } from '../services/api';

const { Title } = Typography;

interface CategoryData {
  category: string;
  projectCount: number;
  totalBudget: number;
  executedAmount: number;
  remainingBudget: number;
  executionRate: number;
  projects: Array<{
    id: number;
    projectName: string;
    subProjectName: string;
    owner: string;
    budgetAmount: number;
    executedAmount: number;
    executionRate: number;
  }>;
}

const StatisticsByCategory: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryStatistics();
  }, []);

  const loadCategoryStatistics = async () => {
    try {
      setLoading(true);
      
      // Get all projects grouped by category
      const projectResponse = await projectAPI.getAll({ limit: 1000, year: '2026' });
      if (projectResponse.data.success && projectResponse.data.data) {
        const projects = projectResponse.data.data.projects;
        
        // Group projects by category
        const categoryMap = new Map<string, CategoryData>();
        
        projects.forEach((project: any) => {
          const category = project.category;
          const budgetAmount = parseFloat(String(project.budgetAmount));
          const executedAmount = parseFloat(String(project.executedAmount || 0));
          const remainingBudget = budgetAmount - executedAmount;
          const executionRate = budgetAmount > 0 ? (executedAmount / budgetAmount) * 100 : 0;
          
          if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              category,
              projectCount: 0,
              totalBudget: 0,
              executedAmount: 0,
              remainingBudget: 0,
              executionRate: 0,
              projects: [],
            });
          }
          
          const categoryStats = categoryMap.get(category)!;
          categoryStats.projectCount += 1;
          categoryStats.totalBudget += budgetAmount;
          categoryStats.executedAmount += executedAmount;
          categoryStats.remainingBudget += remainingBudget;
          categoryStats.projects.push({
            id: project.id,
            projectName: project.projectName,
            subProjectName: project.subProjectName || '',
            owner: project.owner,
            budgetAmount,
            executedAmount,
            executionRate,
          });
        });
        
        // Calculate execution rates for each category
        categoryMap.forEach((stats) => {
          stats.executionRate = stats.totalBudget > 0 
            ? (stats.executedAmount / stats.totalBudget) * 100 
            : 0;
        });
        
        setCategoryData(Array.from(categoryMap.values()));
      }
    } catch (error) {
      console.error('Failed to load category statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const pieData = categoryData.map(item => ({
    name: item.category,
    value: item.totalBudget,
  }));

  const barData = categoryData.map(item => ({
    category: item.category,
    项目数量: item.projectCount,
    总预算: item.totalBudget,
    已执行: item.executedAmount,
    剩余预算: item.remainingBudget,
  }));

  const categoryColumns = [
    {
      title: '项目分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={
          category === 'IDC-架构研发' ? 'blue' : 
          category === '高校合作' ? 'green' : 'orange'
        }>
          {category}
        </Tag>
      ),
    },
    {
      title: '项目数量',
      dataIndex: 'projectCount',
      key: 'projectCount',
      render: (count: number) => `${count} 个`,
      sorter: (a: CategoryData, b: CategoryData) => a.projectCount - b.projectCount,
    },
    {
      title: '总预算（万元）',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: CategoryData, b: CategoryData) => a.totalBudget - b.totalBudget,
    },
    {
      title: '已执行（万元）',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: CategoryData, b: CategoryData) => a.executedAmount - b.executedAmount,
    },
    {
      title: '剩余预算（万元）',
      dataIndex: 'remainingBudget',
      key: 'remainingBudget',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: CategoryData, b: CategoryData) => a.remainingBudget - b.remainingBudget,
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number) => (
        <Tag color={rate > 80 ? 'red' : rate > 50 ? 'orange' : 'green'}>
          {rate.toFixed(1)}%
        </Tag>
      ),
      sorter: (a: CategoryData, b: CategoryData) => a.executionRate - b.executionRate,
    },
  ];

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '子项目名称',
      dataIndex: 'subProjectName',
      key: 'subProjectName',
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '预算金额（万元）',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '已执行（万元）',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number) => (
        <Tag color={rate > 80 ? 'red' : rate > 50 ? 'orange' : 'green'}>
          {rate.toFixed(1)}%
        </Tag>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>分类统计</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {categoryData.map((category, index) => (
          <Col span={8} key={category.category}>
            <Card>
              <Statistic
                title={category.category}
                value={category.totalBudget}
                precision={2}
                suffix="万元"
                valueStyle={{ color: COLORS[index % COLORS.length] }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#666' }}>
                  {category.projectCount}个项目 | 执行率{category.executionRate.toFixed(1)}%
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="各分类预算分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`¥${parseFloat(String(value)).toFixed(2)}万`, '预算金额']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="各分类预算执行对比">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="总预算" fill="#8884d8" />
                <Bar dataKey="已执行" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 分类详细统计表 */}
      <Card title="分类统计详情" style={{ marginBottom: 24 }}>
        <Table
          columns={categoryColumns}
          dataSource={categoryData}
          pagination={false}
          rowKey="category"
        />
      </Card>

      {/* 各分类项目详情 */}
      {categoryData.map((category) => (
        <Card 
          key={category.category} 
          title={`${category.category} - 项目明细`}
          style={{ marginBottom: 24 }}
        >
          <Table
            columns={projectColumns}
            dataSource={category.projects}
            pagination={{ pageSize: 5 }}
            rowKey="id"
            size="small"
          />
        </Card>
      ))}
    </div>
  );
};

export default StatisticsByCategory;