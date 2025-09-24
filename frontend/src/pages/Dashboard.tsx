import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Modal, Form, InputNumber, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { statisticsAPI, totalBudgetAPI } from '../services/api';
import { DashboardStats } from '../types';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditBudgetModalVisible, setIsEditBudgetModalVisible] = useState(false);
  const [budgetForm] = Form.useForm();

  const currentYear = new Date().getFullYear().toString();
  const currentUsername = localStorage.getItem('username') || '';

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
      message.error('加载仪表板数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTotalBudget = async (values: any) => {
    try {
      const response = await totalBudgetAPI.update(currentYear, values.totalAmount);
      if (response.data.success) {
        message.success('总预算更新成功');
        setIsEditBudgetModalVisible(false);
        budgetForm.resetFields();
        // Reload dashboard data to reflect changes
        loadDashboardData();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '总预算更新失败');
    }
  };

  const executionColumns = [
    {
      title: '项目名称',
      dataIndex: ['executionProject', 'projectName'],
      key: 'projectName',
      render: (name: string, record: any) =>
        name || record.project?.projectName || '未知项目',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>预算执行总览</Title>
        {currentUsername === 'jessyyang' && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              budgetForm.setFieldsValue({ totalAmount: dashboardData?.总预算 || 0 });
              setIsEditBudgetModalVisible(true);
            }}
          >
            编辑总预算
          </Button>
        )}
      </div>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总预算（万元）"
              value={dashboardData.总预算}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={
                <span>
                  已执行金额（万元）
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>财管</span>
                </span>
              }
              value={dashboardData.已执行金额}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={
                <span>
                  剩余预算（万元）
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>财管</span>
                </span>
              }
              value={dashboardData.剩余预算}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={
                <span>
                  预算执行率
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>财管</span>
                </span>
              }
              value={dashboardData.预算执行率}
              precision={2}
              suffix="%"
              valueStyle={{
                color: dashboardData.预算执行率 > 80 ? '#f5222d' : '#52c41a'
              }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={
                <span>
                  预计执行金额（万元）
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>架构组</span>
                </span>
              }
              value={dashboardData.预计执行金额}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={
                <span>
                  预计剩余预算（万元）
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>架构组</span>
                </span>
              }
              value={dashboardData.预计剩余预算}
              precision={2}
              valueStyle={{ color: '#13c2c2' }}
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
                  <div style={{ marginBottom: 16 }}>
                    <Statistic
                      title={stat.category}
                      value={stat.totalBudget}
                      precision={2}
                      suffix="万元"
                      valueStyle={{ fontSize: '20px' }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Statistic
                        title="已执行金额"
                        value={stat.executedAmount || 0}
                        precision={2}
                        suffix="万元"
                        valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                      />
                    </div>
                    <p style={{ margin: 0, color: '#666', marginTop: 8 }}>
                      {stat.projectCount} 个项目
                    </p>
                  </div>
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

      <Modal
        title={`编辑${currentYear}年总预算`}
        open={isEditBudgetModalVisible}
        onCancel={() => {
          setIsEditBudgetModalVisible(false);
          budgetForm.resetFields();
        }}
        footer={null}
      >
        <Form form={budgetForm} onFinish={handleEditTotalBudget} layout="vertical">
          <Form.Item
            label="总预算金额（万元）"
            name="totalAmount"
            rules={[
              { required: true, message: '请输入总预算金额' },
              { type: 'number', min: 0, message: '总预算必须大于0' }
            ]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              placeholder="输入总预算金额"
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button
              onClick={() => setIsEditBudgetModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              更新总预算
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;