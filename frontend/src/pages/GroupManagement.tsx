import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Typography,
  Tag,
  Avatar,
  Tooltip,
  Row,
  Col,
  Alert
} from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  CrownOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

interface User {
  id: number;
  username: string;
  displayName: string;
  role: string;
  department?: string;
  position?: string;
}

interface GroupMember {
  id: number;
  userId: number;
  joinedAt: string;
  user: User;
}

interface Group {
  id: number;
  groupName: string;
  description?: string;
  pm: User;
  members: GroupMember[];
  isActive: boolean;
}

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [createForm] = Form.useForm();
  const [addMemberForm] = Form.useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      loadGroups(user.id);
    }
  }, []);

  const loadGroups = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/groups?userId=${userId}`);
      if (response.data.success) {
        setGroups(response.data.data);
      }
    } catch (error) {
      message.error('加载组列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (values: { groupName: string; description?: string }) => {
    if (!currentUser) return;

    if (currentUser.role !== 'pm') {
      message.error('只有项目经理可以创建组');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/groups`, {
        ...values,
        pmId: currentUser.id,
        createdBy: currentUser.id
      });

      if (response.data.success) {
        message.success('组创建成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        loadGroups(currentUser.id);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建组失败');
    }
  };

  const handleAddMember = async (values: { username: string; displayName: string }) => {
    if (!selectedGroup || !currentUser) return;

    if (!values.username || !values.username.trim()) {
      message.error('请输入用户名');
      return;
    }

    if (!values.displayName || !values.displayName.trim()) {
      message.error('请输入显示名称');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/groups/${selectedGroup.id}/members`, {
        username: values.username.trim(),
        displayName: values.displayName.trim(),
        addedBy: currentUser.id
      });

      if (response.data.success) {
        message.success('成员添加成功');
        setAddMemberModalVisible(false);
        addMemberForm.resetFields();
        await loadGroups(currentUser.id);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '添加成员失败');
    }
  };

  const handleRemoveMember = (groupId: number, userId: number, userName: string) => {
    console.log('Remove member button clicked:', { groupId, userId, userName });
    Modal.confirm({
      title: '确认移除成员',
      content: `确定要从组中移除 ${userName} 吗？`,
      okText: '移除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        console.log('Remove member confirmed:', { groupId, userId });
        try {
          console.log('Calling API to remove member...');
          const response = await axios.delete(`${API_BASE_URL}/groups/${groupId}/members/${userId}`, {
            data: { removedBy: currentUser?.id }
          });
          console.log('Remove member response:', response);

          if (response.data.success) {
            message.success('成员移除成功');
            await loadGroups(currentUser?.id || 0);
          }
        } catch (error: any) {
          console.error('Remove member error:', error);
          message.error(error.response?.data?.message || '移除成员失败');
        }
      }
    });
  };

  const openAddMemberModal = (group: Group) => {
    setSelectedGroup(group);
    setAddMemberModalVisible(true);
  };

  const columns = [
    {
      title: '组名',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (name: string) => (
        <Space>
          <TeamOutlined style={{ color: '#1890ff' }} />
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => desc || '-'
    },
    {
      title: 'PM',
      dataIndex: 'pm',
      key: 'pm',
      render: (pm: User) => (
        <Space>
          <Avatar size="small" icon={<CrownOutlined />} style={{ backgroundColor: '#f56a00' }} />
          <Text>{pm.displayName}</Text>
          <Tag color="gold">PM</Tag>
        </Space>
      )
    },
    {
      title: '成员数量',
      dataIndex: 'members',
      key: 'memberCount',
      render: (members: GroupMember[]) => (
        <Tag color="blue">{members?.length || 0} 人</Tag>
      )
    },
    {
      title: '成员列表',
      dataIndex: 'members',
      key: 'members',
      render: (members: GroupMember[], record: Group) => (
        <Space wrap>
          {members?.map((member) => (
            <Tooltip key={member.id} title={`${member.user.displayName} (${member.user.role})`}>
              <Tag
                closable={
                  currentUser?.id === record.pm.id &&
                  member.user.id !== record.pm.id
                }
                onClose={() => handleRemoveMember(record.id, member.user.id, member.user.displayName)}
                style={{ marginBottom: 4 }}
              >
                <UserOutlined /> {member.user.displayName}
              </Tag>
            </Tooltip>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Group) => {
        const isOwner = currentUser?.id === record.pm.id;

        return (
          <Space>
            {isOwner && (
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => openAddMemberModal(record)}
              >
                添加成员
              </Button>
            )}
            {isOwner && (
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => message.info('编辑功能开发中')}
              >
                编辑
              </Button>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>
            <TeamOutlined /> 组管理
          </Title>
          <Text type="secondary">
            管理您的项目组和团队成员
          </Text>
        </Col>
        <Col>
          {currentUser?.role === 'pm' && (
            <Button
              type="primary"
              icon={<TeamOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              创建新组
            </Button>
          )}
        </Col>
      </Row>

      {currentUser?.role !== 'pm' && (
        <Alert
          message="权限说明"
          description="只有项目经理(PM)可以创建和管理组。您可以查看您所属的组信息。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={groups}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个组`
          }}
        />
      </Card>

      {/* 创建组模态框 */}
      <Modal
        title="创建新组"
        visible={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={createForm}
          onFinish={handleCreateGroup}
          layout="vertical"
        >
          <Form.Item
            name="groupName"
            label="组名"
            rules={[
              { required: true, message: '请输入组名' },
              { max: 50, message: '组名不能超过50个字符' }
            ]}
          >
            <Input placeholder="例如：前端开发组" />
          </Form.Item>

          <Form.Item
            name="description"
            label="组描述"
            rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          >
            <TextArea
              placeholder="描述这个组的职责和目标..."
              rows={3}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                创建组
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加成员模态框 */}
      <Modal
        title={`向 "${selectedGroup?.groupName}" 添加成员`}
        visible={addMemberModalVisible}
        onCancel={() => {
          setAddMemberModalVisible(false);
          addMemberForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={addMemberForm}
          onFinish={handleAddMember}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
          >
            <Input
              placeholder="请输入用户名（例如：zhangsan）"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            name="displayName"
            label="显示名称"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input
              placeholder="请输入显示名称（例如：张三）"
              maxLength={50}
            />
          </Form.Item>

          <Alert
            message="提示"
            description="输入用户名和显示名称后，如果该用户不存在，系统会自动创建该用户账号。用户首次登录时使用该用户名即可。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setAddMemberModalVisible(false);
                addMemberForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                添加成员
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupManagement;