import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Select, message, Tag, Space, Badge, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { userAPI } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const ADMIN_USERNAMES = ['jessyyang', 'wenyuyang', 'yangwenyu'];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const currentUsername = localStorage.getItem('username') || '';
  const isAdmin = ADMIN_USERNAMES.includes(currentUsername);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const response = await userAPI.create(values);
      if (response.data.success) {
        message.success(`用户 ${values.displayName} 创建成功`);
        setIsCreateModalVisible(false);
        createForm.resetFields();
        loadUsers();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建用户失败');
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingUser) return;
    try {
      const response = await userAPI.update(editingUser.id, values);
      if (response.data.success) {
        message.success('用户信息更新成功');
        setIsEditModalVisible(false);
        setEditingUser(null);
        editForm.resetFields();
        loadUsers();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '更新失败');
    }
  };

  const handleToggleActive = async (user: any) => {
    try {
      const response = await userAPI.toggleActive(user.id);
      if (response.data.success) {
        message.success(`用户 ${user.displayName} 已${user.isActive ? '禁用' : '启用'}`);
        loadUsers();
      }
    } catch (error: any) {
      message.error('操作失败');
    }
  };

  const handleApprove = async (user: any) => {
    try {
      const response = await userAPI.toggleActive(user.id);
      if (response.data.success) {
        message.success(`已批准用户 ${user.username} 的注册申请`);
        loadUsers();
      }
    } catch (error: any) {
      message.error('批准失败');
    }
  };

  const pendingUsers = users.filter(u => !u.isActive);
  const activeUsers = users.filter(u => u.isActive);

  const activeColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '显示名',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'pm' ? 'blue' : 'green'}>
          {role === 'pm' ? '项目经理' : '普通员工'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date: string) => date ? new Date(date).toLocaleString() : '从未登录',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              editForm.setFieldsValue({
                displayName: record.displayName,
                role: record.role,
              });
              setIsEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<StopOutlined />}
            onClick={() => handleToggleActive(record)}
          >
            禁用
          </Button>
        </Space>
      ),
    },
  ];

  const pendingColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '显示名',
      dataIndex: 'displayName',
      key: 'displayName',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
          >
            批准
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              editForm.setFieldsValue({
                displayName: record.displayName,
                role: record.role,
              });
              setIsEditModalVisible(true);
            }}
          >
            编辑后批准
          </Button>
        </Space>
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <Card>
        <Title level={4}>无权限访问</Title>
        <p>只有管理员可以管理用户账号。</p>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>用户管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          新建用户
        </Button>
      </div>

      <Tabs
        defaultActiveKey={pendingUsers.length > 0 ? 'pending' : 'active'}
        items={[
          {
            key: 'pending',
            label: (
              <Badge count={pendingUsers.length} offset={[10, 0]}>
                <span>待审批</span>
              </Badge>
            ),
            children: (
              <Card>
                {pendingUsers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    暂无待审批的注册申请
                  </div>
                ) : (
                  <Table
                    columns={pendingColumns}
                    dataSource={pendingUsers}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                  />
                )}
              </Card>
            ),
          },
          {
            key: 'active',
            label: `已启用 (${activeUsers.length})`,
            children: (
              <Card>
                <Table
                  columns={activeColumns}
                  dataSource={activeUsers}
                  loading={loading}
                  rowKey="id"
                  pagination={{ pageSize: 20 }}
                />
              </Card>
            ),
          },
        ]}
      />

      <Modal
        title="新建用户"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form form={createForm} onFinish={handleCreate} layout="vertical">
          <Form.Item
            label="用户名（英文）"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="输入英文用户名，如 zhangsan" />
          </Form.Item>
          <Form.Item
            label="显示名称（中文）"
            name="displayName"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input placeholder="输入中文姓名，如 张三" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            initialValue="employee"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Option value="employee">普通员工</Option>
              <Option value="pm">项目经理</Option>
            </Select>
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsCreateModalVisible(false)} style={{ marginRight: 8 }}>取消</Button>
            <Button type="primary" htmlType="submit">创建</Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={`编辑用户 - ${editingUser?.username}`}
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical">
          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Option value="employee">普通员工</Option>
              <Option value="pm">项目经理</Option>
            </Select>
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsEditModalVisible(false)} style={{ marginRight: 8 }}>取消</Button>
            <Button type="primary" htmlType="submit">更新</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
