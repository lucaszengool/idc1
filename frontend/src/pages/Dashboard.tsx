import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Modal, Form, InputNumber, message, Tabs, Input, Divider, Space, Tooltip } from 'antd';
import { EditOutlined, UploadOutlined, ClockCircleOutlined, CheckSquareOutlined, WalletOutlined, LockOutlined } from '@ant-design/icons';
import { statisticsAPI, totalBudgetAPI, projectAPI } from '../services/api';
import { DashboardStats } from '../types';
import { safeToFixed, formatCurrency, safeParseFloat } from '../utils/number';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 锁定的年份 - 这些年份的数据不能被修改
const LOCKED_YEARS = ['2025'];

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditBudgetModalVisible, setIsEditBudgetModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [budgetForm] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const currentYear = new Date().getFullYear().toString();
  const currentUsername = localStorage.getItem('username') || '';

  useEffect(() => {
    loadDashboardData();
  }, [selectedYear]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await statisticsAPI.getDashboard(selectedYear);
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
      const response = await totalBudgetAPI.update(selectedYear, values.totalAmount);
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

  // 处理批量上传项目预算数据
  const handleUploadBudgetData = async (values: any) => {
    try {
      setUploadLoading(true);
      const { budgetData } = values;

      // 解析JSON格式的预算数据
      let parsedData;
      try {
        parsedData = JSON.parse(budgetData);
      } catch (e) {
        message.error('JSON格式错误，请检查输入');
        return;
      }

      if (!Array.isArray(parsedData)) {
        message.error('数据格式错误，请提供项目数组');
        return;
      }

      // 使用批量导入API
      const response = await projectAPI.batchImport(parsedData, selectedYear);

      if (response.data.success) {
        const { created, updated, errors } = response.data.data!;
        if (created > 0 || updated > 0) {
          message.success(`成功创建 ${created} 个项目，更新 ${updated} 个项目`);
          loadDashboardData();
        }
        if (errors && errors.length > 0) {
          message.warning(`${errors.length} 个项目处理失败`);
          console.error('导入错误:', errors);
        }
      }

      setIsUploadModalVisible(false);
      uploadForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || '上传失败');
    } finally {
      setUploadLoading(false);
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
      render: (amount: number | string) => formatCurrency(amount, 2),
    },
    {
      title: '执行日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
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
      render: (amount: number | string) => `${formatCurrency(amount, 2)}万`,
    },
    {
      title: '已执行',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount: number | string) => `${formatCurrency(amount, 2)}万`,
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number | string) => {
        const numRate = safeParseFloat(rate);
        return (
          <Tag color={numRate > 90 ? 'red' : 'orange'}>
            {safeToFixed(numRate, 1)}%
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
        {(currentUsername === 'jessyyang' || currentUsername === 'wenyuyang') && (
          <Space>
            {LOCKED_YEARS.includes(selectedYear) ? (
              <Tooltip title={`${selectedYear}年数据已锁定，仅供查看`}>
                <Button
                  type="primary"
                  icon={<LockOutlined />}
                  disabled
                >
                  数据已锁定
                </Button>
              </Tooltip>
            ) : (
              <>
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
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => setIsUploadModalVisible(true)}
                >
                  上传预算数据
                </Button>
              </>
            )}
          </Space>
        )}
      </div>

      <Tabs
        activeKey={selectedYear}
        onChange={setSelectedYear}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab={<span><LockOutlined style={{ marginRight: 4 }} />2025年（已锁定）</span>} key="2025" />
        <TabPane tab="2026年" key="2026" />
      </Tabs>

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
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>(for 财管)</span>
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
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>(for 财管)</span>
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
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>(for 财管)</span>
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
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>(for 架构组内部)</span>
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
                  <span style={{ fontSize: '10px', color: '#666', marginLeft: 4 }}>(for 架构组内部)</span>
                </span>
              }
              value={dashboardData.预计剩余预算}
              precision={2}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 预算分类统计卡片 - 2026年只显示已完成验收 */}
      {selectedYear === '2025' ? (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card
              title={
                <span>
                  <ClockCircleOutlined style={{ marginRight: 8, color: '#faad14' }} />
                  预提待使用预算
                </span>
              }
              extra={<Tag color="orange">{dashboardData.预提待使用项目?.length || 0} 个项目</Tag>}
            >
              <Statistic
                value={dashboardData.预提待使用预算 || 0}
                precision={2}
                suffix="万元"
                valueStyle={{ color: '#faad14', fontSize: '28px' }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {dashboardData.预提待使用项目?.map((project, index) => (
                  <div key={project.id} style={{ marginBottom: 8, padding: '4px 0', borderBottom: index < (dashboardData.预提待使用项目?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text ellipsis style={{ maxWidth: '60%' }}>{project.projectName}</Text>
                      <Text strong style={{ color: '#faad14' }}>{safeToFixed(project.budgetAmount, 2)}万</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title={
                <span>
                  <CheckSquareOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  已完成验收预算
                </span>
              }
              extra={<Tag color="green">{dashboardData.已完成验收项目?.length || 0} 个项目</Tag>}
            >
              <Statistic
                value={dashboardData.已完成验收预算 || 0}
                precision={2}
                suffix="万元"
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {dashboardData.已完成验收项目?.map((project, index) => (
                  <div key={project.id} style={{ marginBottom: 8, padding: '4px 0', borderBottom: index < (dashboardData.已完成验收项目?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text ellipsis style={{ maxWidth: '60%' }}>{project.projectName}</Text>
                      <Text strong style={{ color: '#52c41a' }}>{safeToFixed(project.executedAmount, 4)}万</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title={
                <span>
                  <WalletOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  剩余未使用预算
                </span>
              }
              extra={<Tag color="blue">可支配</Tag>}
            >
              <Statistic
                value={dashboardData.剩余未使用预算 || 0}
                precision={2}
                suffix="万元"
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <Text type="secondary">
                  总预算 {safeToFixed(dashboardData.总预算, 2)}万 - 预提待使用 {safeToFixed(dashboardData.预提待使用预算 || 0, 2)}万 - 已验收 {safeToFixed(dashboardData.已完成验收预算 || 0, 2)}万
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        /* 2026年只显示已完成验收预算 */
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card
              title={
                <span>
                  <CheckSquareOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  已完成验收预算
                </span>
              }
              extra={<Tag color="green">{dashboardData.已完成验收项目?.length || 0} 个项目</Tag>}
            >
              <Statistic
                value={dashboardData.已完成验收预算 || 0}
                precision={2}
                suffix="万元"
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {dashboardData.已完成验收项目?.map((project, index) => (
                  <div key={project.id} style={{ marginBottom: 8, padding: '4px 0', borderBottom: index < (dashboardData.已完成验收项目?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text ellipsis style={{ maxWidth: '60%' }}>{project.projectName}</Text>
                      <Text strong style={{ color: '#52c41a' }}>{safeToFixed(project.executedAmount, 4)}万</Text>
                    </div>
                  </div>
                ))}
                {(!dashboardData.已完成验收项目 || dashboardData.已完成验收项目.length === 0) && (
                  <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <Text type="secondary">暂无已完成验收的项目</Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title={`${selectedYear}年研发费预算评审目录`}>
            <Row gutter={16}>
              {dashboardData.categoryStats.map((stat, index) => (
                <Col span={8} key={index}>
                  <Card
                    type="inner"
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{stat.category}</span>
                        <span style={{ fontSize: '14px', color: '#1890ff' }}>
                          {safeToFixed(stat.totalBudget, 0)}万元
                        </span>
                      </div>
                    }
                    style={{ marginBottom: 16 }}
                  >
                    {stat.projects && stat.projects.map((project: any, pIndex: number) => (
                      <div
                        key={pIndex}
                        style={{
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottom: pIndex < stat.projects.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: 4 }}>
                              {project.projectName}
                            </div>
                            {project.subProjectName && project.subProjectName !== project.projectName && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                子项目: {project.subProjectName}
                              </div>
                            )}
                            {project.owner && (
                              <div style={{ fontSize: '12px', color: '#888', marginTop: 2 }}>
                                负责人: {project.owner}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#666' }}>预算占用(B):</span>
                              <span style={{ color: '#1890ff', fontWeight: 500 }}>{safeToFixed(project.budgetAmount, 2)}万</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#666' }}>预算执行(C):</span>
                              <span style={{ color: '#52c41a', fontWeight: 500 }}>{safeToFixed(project.executedAmount, 2)}万</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#666' }}>立项剩余(B-C):</span>
                              <span style={{ color: '#faad14', fontWeight: 500 }}>{safeToFixed(safeParseFloat(project.budgetAmount) - safeParseFloat(project.executedAmount), 2)}万</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                        <span>{stat.projectCount} 个子项目</span>
                        <span>已执行: {safeToFixed(stat.executedAmount, 2)}万元</span>
                      </div>
                    </div>
                  </Card>
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
        title={`编辑${selectedYear}年总预算`}
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

      {/* 上传预算数据Modal */}
      <Modal
        title={`上传${selectedYear}年项目预算数据`}
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          uploadForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={uploadForm} onFinish={handleUploadBudgetData} layout="vertical">
          <Form.Item
            label={
              <span>
                预算数据（JSON格式）
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  上传后将自动刷新整体预算金额
                </Text>
              </span>
            }
            name="budgetData"
            rules={[{ required: true, message: '请输入预算数据' }]}
          >
            <Input.TextArea
              rows={15}
              placeholder={`请输入JSON格式的项目预算数据，例如：
[
  {
    "id": 1,                          // 可选：如有ID则更新现有项目
    "projectName": "项目名称",
    "budgetAmount": 45,               // 预算金额（万元）
    "executedAmount": 0,              // 已执行金额（万元）
    "budgetYear": "${selectedYear}"   // 预算年份
  },
  {
    "projectCode": "RDBP202507280003",
    "projectName": "新项目名称",
    "category": "IDC架构研发",
    "budgetAmount": 30,
    "executedAmount": 15,
    "projectType": "重点",
    "owner": "负责人",
    "projectGoal": "项目目标",
    "projectBackground": "项目背景",
    "projectExplanation": "推导说明"
  }
]`}
            />
          </Form.Item>

          <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginBottom: 16 }}>
            <Text strong>数据说明：</Text>
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>如果项目包含 <code>id</code> 字段，将更新现有项目的预算金额</li>
              <li>如果不包含 <code>id</code>，将创建新项目（需提供完整信息）</li>
              <li><code>budgetAmount</code>：预算占用金额（万元）</li>
              <li><code>executedAmount</code>：已执行/验收金额（万元），0表示预提待使用</li>
              <li>上传成功后，看板将自动刷新显示最新数据</li>
            </ul>
          </div>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button
              onClick={() => {
                setIsUploadModalVisible(false);
                uploadForm.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={uploadLoading}>
              上传并刷新预算
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;