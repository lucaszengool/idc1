import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import AppLayout from './Layout';

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      const username = localStorage.getItem('username');
      const loginTime = localStorage.getItem('loginTime');

      if (user && username && loginTime) {
        // 检查登录是否过期（24小时）
        const loginTimestamp = new Date(loginTime).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - loginTimestamp;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (timeDiff < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // 登录已过期，清除本地存储
          localStorage.removeItem('user');
          localStorage.removeItem('username');
          localStorage.removeItem('loginTime');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoute;