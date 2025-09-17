import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Select, Modal, Typography } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

interface LoginFormValues {
  username: string;
}

interface RoleSelectionValues {
  role: 'employee' | 'pm';
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError('');


    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: values.username
      });

      if (response.data.success) {
        const userData = response.data.data;

        // 保存用户信息到localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('username', values.username);
        localStorage.setItem('loginTime', new Date().toISOString());

        // 根据用户角色跳转到不同页面
        if (userData.role === 'pm') {
          navigate('/pm-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      if (err.response?.data?.requiresRoleSelection) {
        // 新用户需要选择角色
        setCurrentUsername(values.username);
        setShowRoleSelection(true);
      } else {
        setError(err.response?.data?.message || '登录失败，请检查用户名');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (values: RoleSelectionValues) => {
    setLoading(true);
    setError('');


    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: currentUsername,
        role: values.role
      });

      if (response.data.success) {
        const userData = response.data.data;

        // 保存用户信息到localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('username', currentUsername);
        localStorage.setItem('loginTime', new Date().toISOString());

        setShowRoleSelection(false);

        // 根据用户角色跳转到不同页面
        if (userData.role === 'pm') {
          navigate('/pm-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '角色选择失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#ffffff'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>DCOPS预算管理系统</Title>
          <Text type="secondary">请输入您的姓名进入系统</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="姓名"
            rules={[
              { required: true, message: '请输入您的姓名' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入您的姓名"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              进入系统
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 角色选择模态框 */}
      <Modal
        title="选择您的角色"
        open={showRoleSelection}
        closable={false}
        footer={null}
        width={400}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>欢迎 <strong>{currentUsername}</strong>！请选择您的角色：</Text>
        </div>

        <Form
          name="roleSelection"
          onFinish={handleRoleSelection}
          layout="vertical"
        >
          <Form.Item
            name="role"
            label="角色"
            rules={[
              { required: true, message: '请选择您的角色' }
            ]}
          >
            <Select placeholder="请选择角色" size="large">
              <Option value="employee">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  普通员工
                </div>
              </Option>
              <Option value="pm">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TeamOutlined style={{ marginRight: 8 }} />
                  项目经理 (PM)
                </div>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              确认选择
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;