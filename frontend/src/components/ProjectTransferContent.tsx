import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Space,
  message,
  Typography,
  Tag,
  Steps,
  Row,
  Col,
  Alert,
  InputNumber
} from 'antd';
import {
  SwapOutlined,
  ProjectOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

interface User {
  id: number;
  username: string;
  displayName: string;
  role: string;
}

interface Group {
  id: number;
  groupName: string;
  pm: User;
}

interface Project {
  id: number;
  projectName: string;
  projectCode: string;
  budgetOccupied: number;
}

interface ProjectTransfer {
  id: number;
  project: Project;
  fromUser: User;
  toUser: User;
  fromGroup: Group;
  toGroup: Group;
  transferType: string;
  transferAmount?: number;
  reason: string;
  status: string;
  createdAt: string;
}

interface ProjectTransferContentProps {
  onRefresh: () => void;
}

const ProjectTransferContent: React.FC<ProjectTransferContentProps> = ({ onRefresh }) => {
  const [transfers, setTransfers] = useState<ProjectTransfer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [form] = Form.useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      loadTransfers(user.id);
      loadProjects();
      loadGroups();
      loadAllUsers(); // 初始加载所有用户
    }
  }, []);

  const loadTransfers = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/project-transfers?userId=${userId}`);
      if (response.data.success) {
        setTransfers(response.data.data);
      }
    } catch (error) {
      message.error('加载转移记录失败');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects?limit=100`);
      if (response.data.success) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/groups`);
      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`);
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      // 如果没有users endpoint，尝试搜索
      searchUsers('');
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/search-users?query=${query || ''}`);
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleCreateTransfer = async () => {
    if (!currentUser) {
      message.error('用户未登录');
      return;
    }

    try {
      // 获取所有字段值（包括之前步骤的值）
      const allValues = form.getFieldsValue();
      console.log('表单数据:', allValues);

      // 验证最后一步
      try {
        await form.validateFields(['reason']);
      } catch (validationError) {
        console.log('验证失败:', validationError);
        message.error('请填写转移原因（至少10个字符）');
        return;
      }

      // 检查必填字段
      if (!allValues.projectId) {
        message.error('请选择要转移的项目');
        setCurrentStep(0);
        return;
      }
      if (!allValues.transferType) {
        message.error('请选择转移类型');
        setCurrentStep(0);
        return;
      }
      if (!allValues.fromUserName || !allValues.fromGroupName) {
        message.error('请填写当前归属信息');
        setCurrentStep(1);
        return;
      }
      if (!allValues.toUserName || !allValues.toGroupName) {
        message.error('请填写目标归属信息');
        setCurrentStep(2);
        return;
      }

      // 将输入的名称转换为简化格式
      const transferData = {
        projectId: allValues.projectId,
        transferType: allValues.transferType,
        fromUserName: allValues.fromUserName,
        fromGroupName: allValues.fromGroupName,
        toUserName: allValues.toUserName,
        toGroupName: allValues.toGroupName,
        transferAmount: allValues.transferAmount,
        reason: allValues.reason,
        requesterId: currentUser.id
      };

      console.log('提交数据:', transferData);
      const response = await axios.post(`${API_BASE_URL}/project-transfers`, transferData);

      if (response.data.success) {
        message.success('项目转移请求已提交');
        setCreateModalVisible(false);
        form.resetFields();
        setCurrentStep(0);
        loadTransfers(currentUser.id);
        onRefresh();
      } else {
        message.error(response.data.message || '提交失败');
      }
    } catch (error: any) {
      console.error('提交转移请求失败:', error);
      message.error(error.response?.data?.message || '提交转移请求失败，请检查网络连接');
    }
  };

  const getTransferTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      ownership: '所有权转移',
      budget_reallocation: '预算重新分配',
      execution_transfer: '执行权转移'
    };
    return typeMap[type] || type;
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'blue', text: '已批准' },
      rejected: { color: 'red', text: '已拒绝' },
      completed: { color: 'green', text: '已完成' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      render: (project: Project) => (
        <Space direction="vertical" size="small">
          <Text strong>{project.projectName}</Text>
          <Text type="secondary">{project.projectCode}</Text>
        </Space>
      )
    },
    {
      title: '转移类型',
      dataIndex: 'transferType',
      key: 'transferType',
      render: (type: string) => (
        <Tag color="blue">{getTransferTypeText(type)}</Tag>
      )
    },
    {
      title: '从',
      key: 'from',
      render: (record: ProjectTransfer) => (
        <Space direction="vertical" size="small">
          <Text>{record.fromUser?.displayName}</Text>
          <Text type="secondary">{record.fromGroup?.groupName}</Text>
        </Space>
      )
    },
    {
      title: '到',
      key: 'to',
      render: (record: ProjectTransfer) => (
        <Space direction="vertical" size="small">
          <Text>{record.toUser?.displayName}</Text>
          <Text type="secondary">{record.toGroup?.groupName}</Text>
        </Space>
      )
    },
    {
      title: '转移金额',
      dataIndex: 'transferAmount',
      key: 'transferAmount',
      render: (amount: number) => amount ? `¥${amount.toLocaleString()}` : '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => new Date(time).toLocaleString()
    }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              name="projectId"
              label="选择项目"
              rules={[{ required: true, message: '请选择要转移的项目' }]}
            >
              <Select placeholder="选择项目" showSearch optionFilterProp="children">
                {projects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.projectName} ({project.projectCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="transferType"
              label="转移类型"
              rules={[{ required: true, message: '请选择转移类型' }]}
            >
              <Select placeholder="选择转移类型">
                <Option value="ownership">所有权转移</Option>
                <Option value="budget_reallocation">预算重新分配</Option>
                <Option value="execution_transfer">执行权转移</Option>
              </Select>
            </Form.Item>
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              name="fromUserName"
              label="当前负责人"
              rules={[{ required: true, message: '请输入当前负责人' }]}
            >
              <Input placeholder="输入当前负责人姓名或用户名" />
            </Form.Item>

            <Form.Item
              name="fromGroupName"
              label="当前所属组"
              rules={[{ required: true, message: '请输入当前所属组' }]}
            >
              <Input placeholder="输入当前所属组名称" />
            </Form.Item>
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              name="toUserName"
              label="目标负责人"
              rules={[{ required: true, message: '请输入目标负责人' }]}
            >
              <Input placeholder="输入目标负责人姓名或用户名" />
            </Form.Item>

            <Form.Item
              name="toGroupName"
              label="目标组"
              rules={[{ required: true, message: '请输入目标组' }]}
            >
              <Input placeholder="输入目标组名称" />
            </Form.Item>

            <Form.Item
              name="transferAmount"
              label="转移金额"
              help="预算重新分配时需要填写"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="转移金额（元）"
                min={0}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => (parseFloat(value!.replace(/¥\s?|(,*)/g, '')) || 0) as any}
              />
            </Form.Item>
          </Space>
        );

      case 3:
        return (
          <Form.Item
            name="reason"
            label="转移原因"
            rules={[
              { required: true, message: '请详细说明转移原因' },
              { min: 10, message: '转移原因至少10个字符' }
            ]}
          >
            <TextArea
              placeholder="请详细说明项目转移的原因和背景..."
              rows={4}
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<SwapOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          发起转移
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={transfers}
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                <Text strong>转移原因：</Text>
                {record.reason}
              </Paragraph>
              <Row gutter={16}>
                <Col span={12}>
                  <Paragraph>
                    <Text strong>项目预算：</Text>
                    ¥{record.project.budgetOccupied.toLocaleString()}
                  </Paragraph>
                </Col>
                {record.transferAmount && (
                  <Col span={12}>
                    <Paragraph>
                      <Text strong>转移金额：</Text>
                      ¥{record.transferAmount.toLocaleString()}
                    </Paragraph>
                  </Col>
                )}
              </Row>
            </Space>
          )
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条转移记录`
        }}
      />

      <Modal
        title="发起项目转移"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setCurrentStep(0);
        }}
        footer={null}
        width={800}
      >
        <Alert
          message="项目转移说明"
          description="项目转移需要目标组的PM审核批准。转移成功后，项目的负责人和所属组将发生变更。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="项目信息" icon={<ProjectOutlined />} />
          <Step title="当前归属" icon={<UserSwitchOutlined />} />
          <Step title="目标归属" icon={<UserSwitchOutlined />} />
          <Step title="转移原因" icon={<SwapOutlined />} />
        </Steps>

        <Form
          form={form}
          layout="vertical"
        >
          {renderStepContent()}

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  上一步
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="primary"
                  onClick={async () => {
                    // 验证当前步骤的表单字段
                    try {
                      let fieldsToValidate: string[] = [];
                      if (currentStep === 0) {
                        fieldsToValidate = ['projectId', 'transferType'];
                      } else if (currentStep === 1) {
                        fieldsToValidate = ['fromUserName', 'fromGroupName'];
                      } else if (currentStep === 2) {
                        fieldsToValidate = ['toUserName', 'toGroupName'];
                      }

                      await form.validateFields(fieldsToValidate);
                      setCurrentStep(currentStep + 1);
                    } catch (error) {
                      // 验证失败，不进入下一步
                      console.log('Validation failed:', error);
                    }
                  }}
                >
                  下一步
                </Button>
              ) : (
                <Space>
                  <Button onClick={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                    setCurrentStep(0);
                  }}>
                    取消
                  </Button>
                  <Button type="primary" onClick={handleCreateTransfer}>
                    提交转移请求
                  </Button>
                </Space>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectTransferContent;