import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Typography, Space, Button, Select, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  DashboardOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  SwapOutlined,
  TeamOutlined,
  LogoutOutlined,
  CrownOutlined
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
        ],
      },
      {
        key: '/groups',
        icon: <TeamOutlined />,
        label: '组管理',
      },
    ];

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
    </Layout>
  );
};

export default AppLayout;