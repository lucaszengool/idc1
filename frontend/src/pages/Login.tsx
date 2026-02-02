import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Result } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? `${process.env.REACT_APP_API_BASE_URL}/api`
  : 'http://localhost:3001/api';

interface LoginFormValues {
  username: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [pendingApproval, setPendingApproval] = useState(false);
  const [pendingUsername, setPendingUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError('');
    setPendingApproval(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: values.username
      });

      if (response.data.success) {
        const userData = response.data.data;

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('username', values.username);
        localStorage.setItem('loginTime', new Date().toISOString());

        if (userData.accessKey) {
          localStorage.setItem('accessKey', userData.accessKey);
        }

        if (userData.role === 'pm') {
          navigate('/pm-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      if (err.response?.data?.pendingApproval) {
        setPendingApproval(true);
        setPendingUsername(values.username);
      } else {
        setError(err.response?.data?.message || '登录失败，请检查用户名');
      }
    } finally {
      setLoading(false);
    }
  };

  if (pendingApproval) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffff'
      }}>
        <Card style={{ width: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <Result
            icon={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            title="等待管理员审批"
            subTitle={
              <div>
                <p>您的账号 <strong>{pendingUsername}</strong> 注册申请已提交。</p>
                <p>请联系管理员审批后再登录。</p>
              </div>
            }
            extra={
              <Button type="primary" onClick={() => { setPendingApproval(false); setPendingUsername(''); }}>
                返回登录
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

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
          <Text type="secondary">请输入您的用户名进入系统</Text>
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
            label="用户名"
            rules={[
              { required: true, message: '请输入您的用户名' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入您的用户名"
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
    </div>
  );
};

export default Login;
