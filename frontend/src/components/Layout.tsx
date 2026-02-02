import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Space, Button, Select, message, Modal, Form, Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { userAPI } from '../services/api';
import {
  DashboardOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  SwapOutlined,
  TeamOutlined,
  LogoutOutlined,
  CrownOutlined,
  UserAddOutlined,
  KeyOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer } } = theme.useToken();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();

  const handleChangePassword = async (values: any) => {
    if (!currentUser) return;
    try {
      const response = await userAPI.changePassword(currentUser.id, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      if (response.data.success) {
        message.success('密码修改成功');
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '密码修改失败');
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleRoleChange = async (newRole: 'employee' | 'pm') => {
    if (!currentUser) return;

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile/${currentUser.id}`, {
        ...currentUser,
        role: newRole
      });

      if (response.data.success) {
        const updatedUser = { ...currentUser, role: newRole };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        message.success('角色更新成功');

        // 根据新角色跳转到对应页面
        if (newRole === 'pm') {
          navigate('/pm-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      message.error('角色更新失败');
      console.error('Role change error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: '首页Dashboard',
      },
      {
        key: '/execution',
        icon: <BarChartOutlined />,
        label: '执行管理',
        children: [
          {
            key: '/execution/report',
            icon: <FileDoneOutlined />,
            label: '执行填报',
          },
          {
            key: '/execution/history',
            icon: <BarChartOutlined />,
            label: '执行历史',
          },
        ],
      },
      {
        key: '/statistics',
        icon: <BarChartOutlined />,
        label: '统计分析',
        children: [
          {
            key: '/statistics/overview',
            icon: <DashboardOutlined />,
            label: '统计总览',
          },
          {
            key: '/statistics/by-category',
            icon: <BarChartOutlined />,
            label: '分类统计',
          },
          {
            key: '/statistics/by-owner',
            icon: <BarChartOutlined />,
            label: '负责人统计',
          },
        ],
      },
      {
        key: '/budget',
        icon: <SwapOutlined />,
        label: '预算管理',
        children: [
          {
            key: '/budget/management',
            label: '预算调整',
          },
          {
            key: '/budget/versions',
            label: '预算版本',
          },
        ] as any[],
      },
      {
        key: '/groups',
        icon: <TeamOutlined />,
        label: '组管理',
      },
    ];

    // Add user management for admin users
    const adminUsernames = ['jessyyang', 'wenyuyang', 'yangwenyu'];
    if (adminUsernames.includes(currentUser?.username || '')) {
      baseItems.push({
        key: '/users',
        icon: <UserAddOutlined />,
        label: '用户管理',
      });
    }

    // Add PM-specific items
    if (currentUser?.role === 'pm') {
      baseItems.splice(1, 0, {
        key: '/pm-dashboard',
        icon: <CrownOutlined />,
        label: 'PM审核面板',
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} style={{ background: colorBgContainer }}>
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 16,
        }}>
          DCOPS预算系统
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1890ff',
          }}>
            DCOPS预算管理系统
          </div>

          {currentUser && (
            <Space>
              <Text>欢迎，{currentUser.displayName || currentUser.username}</Text>
              <Select
                value={currentUser.role}
                onChange={handleRoleChange}
                style={{ width: 120 }}
                size="small"
              >
                <Option value="employee">普通员工</Option>
                <Option value="pm">项目经理</Option>
              </Select>
              <Button
                icon={<KeyOutlined />}
                onClick={() => setIsPasswordModalVisible(true)}
                type="text"
                size="small"
              >
                修改密码
              </Button>
              <Button
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                type="text"
                size="small"
              >
                退出
              </Button>
            </Space>
          )}
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: 6,
        }}>
          {children}
        </Content>
      </Layout>

      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
          <Form.Item
            label="旧密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码（至少6位）" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => { setIsPasswordModalVisible(false); passwordForm.resetFields(); }} style={{ marginRight: 8 }}>取消</Button>
            <Button type="primary" htmlType="submit">确认修改</Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AppLayout;