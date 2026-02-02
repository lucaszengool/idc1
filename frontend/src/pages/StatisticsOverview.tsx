import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statisticsAPI } from '../services/api';

const { Title } = Typography;

interface StatsData {
  totalProjects: number;
  totalBudget: number;
  executedAmount: number;
  remainingBudget: number;
  executionRate: number;
  categoryStats: Array<{
    category: string;
    projectCount: number;
    totalBudget: number;
  }>;
}

const StatisticsOverview: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await statisticsAPI.getDashboard('2026');
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setStatsData({
          totalProjects: data.项目总数,
          totalBudget: data.总预算,
          executedAmount: data.已执行金额,
          remainingBudget: data.剩余预算,
          executionRate: data.预算执行率,
          categoryStats: data.categoryStats,
        });
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
    },
    {
      title: '总预算（万元）',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      render: (amount: number) => `¥${parseFloat(String(amount)).toFixed(2)}`,
    },
  ];

  if (loading || !statsData) {
    return <div>Loading...</div>;
  }

  const pieData = statsData.categoryStats.map(item => ({
    name: item.category,
    value: item.totalBudget,
  }));

  const barData = statsData.categoryStats.map(item => ({
    category: item.category,
    项目数量: item.projectCount,
    预算金额: item.totalBudget,
  }));

  return (
    <div>
      <Title level={2}>统计总览</Title>
      
      {/* 基础统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="项目总数"
              value={statsData.totalProjects}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预算（万元）"
              value={statsData.totalBudget}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已执行金额（万元）"
              value={statsData.executedAmount}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="剩余预算（万元）"
              value={statsData.remainingBudget}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 执行率 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="预算执行率">
            <Progress
              percent={statsData.executionRate}
              status={statsData.executionRate > 80 ? 'exception' : 'active'}
              strokeWidth={20}
              format={percent => `${percent}%`}
            />
          </Card>
        </Col>
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
          <Card title="各分类项目统计">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="项目数量" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 详细统计表 */}
      <Card title="分类详细统计">
        <Table
          columns={categoryColumns}
          dataSource={statsData.categoryStats}
          pagination={false}
          rowKey="category"
        />
      </Card>
    </div>
  );
};

export default StatisticsOverview;