import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography } from 'antd';
import { statisticsAPI } from '../services/api';
import { DashboardStats } from '../types';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await statisticsAPI.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data!);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executionColumns = [
    {
      title: '项目名称',
      dataIndex: ['project', 'projectName'],
      key: 'projectName',
    },
    {
      title: '执行金额（万元）',
      dataIndex: 'executionAmount',
      key: 'executionAmount',
      render: (amount: number | string) => `¥${parseFloat(String(amount)).toFixed(2)}`,
    },
    {
      title: '执行日期',
      dataIndex: 'executionDate',
      key: 'executionDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '执行说明',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const highRiskColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '预算金额',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      render: (amount: number | string) => `¥${parseFloat(String(amount)).toFixed(2)}万`,
    },
    {
      title: '已执行',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount: number | string) => `¥${parseFloat(String(amount)).toFixed(2)}万`,
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number | string) => {
        const numRate = parseFloat(String(rate));
        return (
          <Tag color={numRate > 90 ? 'red' : 'orange'}>
            {numRate.toFixed(1)}%
          </Tag>
        );
      },
    },
  ];

  if (loading || !dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>预算执行总览</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预算（万元）"
              value={dashboardData.总预算}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已执行金额（万元）"
              value={dashboardData.已执行金额}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="剩余预算（万元）"
              value={dashboardData.剩余预算}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预算执行率"
              value={dashboardData.预算执行率}
              precision={2}
              suffix="%"
              valueStyle={{ 
                color: dashboardData.预算执行率 > 80 ? '#f5222d' : '#52c41a' 
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="项目总数"
              value={dashboardData.项目总数}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card title="各分类预算分布">
            <Row gutter={16}>
              {dashboardData.categoryStats.map((stat, index) => (
                <Col span={8} key={index}>
                  <Statistic
                    title={stat.category}
                    value={stat.totalBudget}
                    precision={2}
                    suffix="万元"
                  />
                  <p style={{ margin: 0, color: '#666' }}>
                    {stat.projectCount} 个项目
                  </p>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近执行记录" size="small">
            <Table
              columns={executionColumns}
              dataSource={dashboardData.recentExecutions}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="高风险项目（执行率>80%）" size="small">
            <Table
              columns={highRiskColumns}
              dataSource={dashboardData.highRiskProjects}
              size="small"
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;