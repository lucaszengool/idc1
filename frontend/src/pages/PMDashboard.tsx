import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Badge,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Descriptions,
  Typography,
  Alert,
  Space,
  Divider,
  Statistic,
  Tabs
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  ProjectOutlined,
  DollarOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

interface User {
  id: number;
  username: string;
  displayName: string;
  role: string;
  department?: string;
  groups: any[];
}

interface Approval {
  id: number;
  requestType: string;
  requestData: any;
  requester: {
    id: number;
    username: string;
    displayName: string;
  };
  group: {
    id: number;
    groupName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

const PMDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{
    visible: boolean;
    approval: Approval | null;
    action: 'approve' | 'reject' | null;
  }>({
    visible: false,
    approval: null,
    action: null
  });
  const [dashboardStats, setDashboardStats] = useState<any>({});

  const [form] = Form.useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadPendingApprovals(parsedUser.id);
      loadApprovalHistory(parsedUser.id);
      loadDashboardStats();
    }
  }, []);

  const loadPendingApprovals = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/approvals/pending/${userId}`);
      if (response.data.success) {
        setPendingApprovals(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    }
  };

  const loadApprovalHistory = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/approvals/history?userId=${userId}&role=pm`);
      if (response.data.success) {
        setApprovalHistory(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load approval history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics/dashboard`);
      if (response.data.success) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const handleReview = async (values: { reviewNotes?: string }) => {
    if (!reviewModal.approval || !reviewModal.action || !user) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/approvals/review/${reviewModal.approval.id}`,
        {
          action: reviewModal.action,
          reviewNotes: values.reviewNotes || '',
          approverId: user.id
        }
      );

      if (response.data.success) {
        Modal.success({
          title: `${reviewModal.action === 'approve' ? '批准' : '拒绝'}成功`,
          content: `请求已${reviewModal.action === 'approve' ? '批准' : '拒绝'}并执行相关操作。`
        });

        // 刷新数据
        loadPendingApprovals(user.id);
        loadApprovalHistory(user.id);
        loadDashboardStats();

        setReviewModal({ visible: false, approval: null, action: null });
        form.resetFields();
      }
    } catch (error: any) {
      Modal.error({
        title: '操作失败',
        content: error.response?.data?.message || '处理请求时发生错误'
      });
    }
  };

  const openReviewModal = (approval: Approval, action: 'approve' | 'reject') => {
    setReviewModal({
      visible: true,
      approval,
      action
    });
  };

  const getRequestTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      project_create: '项目创建',
      project_update: '项目更新',
      project_transfer: '项目转移',
      execution_create: '预算执行',
      execution_update: '执行更新',
      budget_adjustment: '预算调整'
    };
    return typeMap[type] || type;
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: '待审核' },
      approved: { color: 'green', icon: <CheckCircleOutlined />, text: '已批准' },
      rejected: { color: 'red', icon: <CloseCircleOutlined />, text: '已拒绝' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const renderRequestDetails = (approval: Approval) => {
    const { requestData } = approval;

    switch (approval.requestType) {
      case 'project_create':
        return (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="项目名称">{requestData.projectName}</Descriptions.Item>
            <Descriptions.Item label="项目编号">{requestData.projectCode}</Descriptions.Item>
            <Descriptions.Item label="项目类型">{requestData.projectType}</Descriptions.Item>
            <Descriptions.Item label="预算金额">¥{parseFloat(requestData.budgetOccupied || 0).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="项目目标" span={2}>
              {requestData.projectGoal}
            </Descriptions.Item>
          </Descriptions>
        );

      case 'execution_create':
        return (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="执行金额">¥{parseFloat(requestData.executionAmount || 0).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="执行日期">{requestData.executionDate}</Descriptions.Item>
            <Descriptions.Item label="执行说明" span={2}>
              {requestData.description}
            </Descriptions.Item>
          </Descriptions>
        );

      case 'project_transfer':
        return (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="项目名称">{requestData.projectName}</Descriptions.Item>
            <Descriptions.Item label="转移类型">{requestData.transferType}</Descriptions.Item>
            <Descriptions.Item label="源用户">{requestData.fromUserName}</Descriptions.Item>
            <Descriptions.Item label="目标用户">{requestData.toUserName}</Descriptions.Item>
            <Descriptions.Item label="转移原因" span={2}>
              {requestData.reason}
            </Descriptions.Item>
          </Descriptions>
        );

      default:
        return <Paragraph>{JSON.stringify(requestData, null, 2)}</Paragraph>;
    }
  };

  const pendingColumns = [
    {
      title: '请求类型',
      dataIndex: 'requestType',
      key: 'requestType',
      render: (type: string) => (
        <Tag color="blue">{getRequestTypeText(type)}</Tag>
      )
    },
    {
      title: '申请人',
      dataIndex: ['requester', 'displayName'],
      key: 'requester'
    },
    {
      title: '所属组',
      dataIndex: ['group', 'groupName'],
      key: 'group'
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Approval) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => openReviewModal(record, 'approve')}
          >
            批准
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => openReviewModal(record, 'reject')}
          >
            拒绝
          </Button>
        </Space>
      )
    }
  ];

  const historyColumns = [
    ...pendingColumns.slice(0, -1),
    {
      title: '审核时间',
      dataIndex: 'reviewedAt',
      key: 'reviewedAt',
      render: (time: string) => time ? new Date(time).toLocaleString() : '-'
    },
    {
      title: '审核备注',
      dataIndex: 'reviewNotes',
      key: 'reviewNotes',
      render: (notes: string) => notes || '-'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Title level={2}>
              <TeamOutlined /> PM管理面板
            </Title>
            <Text type="secondary">
              欢迎回来，{user?.displayName}！您有 {pendingApprovals.length} 个待处理的审核请求。
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="待审核请求"
              value={pendingApprovals.length}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总预算（万元）"
              value={dashboardStats.总预算 / 10000}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="可支配预算（万元）"
              value={dashboardStats.可支配预算 / 10000}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="pending">
          <TabPane tab={
            <span>
              <ExclamationCircleOutlined />
              待审核请求 <Badge count={pendingApprovals.length} size="small" />
            </span>
          } key="pending">
            <Alert
              message="审核提醒"
              description="请及时审核团队成员提交的项目和执行请求，确保工作流程顺畅。"
              type="info"
              showIcon
              closable
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={pendingColumns}
              dataSource={pendingApprovals}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender: (record) => (
                  <Card size="small" title="请求详情">
                    {renderRequestDetails(record)}
                  </Card>
                )
              }}
            />
          </TabPane>

          <TabPane tab={
            <span>
              <CheckCircleOutlined />
              审核历史
            </span>
          } key="history">
            <Table
              columns={historyColumns}
              dataSource={approvalHistory}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender: (record) => (
                  <Card size="small" title="请求详情">
                    {renderRequestDetails(record)}
                  </Card>
                )
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={
          <Space>
            {reviewModal.action === 'approve' ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#f5222d' }} />
            )}
            {reviewModal.action === 'approve' ? '批准请求' : '拒绝请求'}
          </Space>
        }
        visible={reviewModal.visible}
        onCancel={() => {
          setReviewModal({ visible: false, approval: null, action: null });
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {reviewModal.approval && (
          <>
            <Alert
              message={`即将${reviewModal.action === 'approve' ? '批准' : '拒绝'}此请求`}
              description={
                <div>
                  <strong>请求类型：</strong>{getRequestTypeText(reviewModal.approval.requestType)}<br />
                  <strong>申请人：</strong>{reviewModal.approval.requester.displayName}<br />
                  <strong>提交时间：</strong>{new Date(reviewModal.approval.submittedAt).toLocaleString()}
                </div>
              }
              type={reviewModal.action === 'approve' ? 'success' : 'warning'}
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Card title="请求详情" size="small" style={{ marginBottom: 16 }}>
              {renderRequestDetails(reviewModal.approval)}
            </Card>

            <Form
              form={form}
              onFinish={handleReview}
              layout="vertical"
            >
              <Form.Item
                name="reviewNotes"
                label="审核备注"
                rules={reviewModal.action === 'reject' ? [
                  { required: true, message: '拒绝时必须填写原因' }
                ] : []}
              >
                <TextArea
                  placeholder={
                    reviewModal.action === 'approve'
                      ? '可选：添加批准备注...'
                      : '请详细说明拒绝原因...'
                  }
                  rows={4}
                />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => {
                    setReviewModal({ visible: false, approval: null, action: null });
                    form.resetFields();
                  }}>
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    danger={reviewModal.action === 'reject'}
                  >
                    确认{reviewModal.action === 'approve' ? '批准' : '拒绝'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PMDashboard;