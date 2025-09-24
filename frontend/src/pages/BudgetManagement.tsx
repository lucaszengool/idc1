import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  Typography,
  Tabs,
  Button,
  Table,
  message,
  Row,
  Col,
  Statistic,
  Space
} from 'antd';
import {
  SwapOutlined,
  PlusOutlined,
  SettingOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { projectAPI, adjustmentAPI, totalBudgetAPI } from '../services/api';
import { Project, BudgetAdjustment as BudgetAdjustmentType } from '../types';
import BudgetAdjustmentContent from '../components/BudgetAdjustmentContent';
import ProjectTransferContent from '../components/ProjectTransferContent';

const { Title } = Typography;
const { TabPane } = Tabs;

const BudgetManagement: React.FC = () => {
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [adjustments, setAdjustments] = useState<BudgetAdjustmentType[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('adjustment');

  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    // Get tab from URL parameter
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'transfer') {
      setActiveTab('transfer');
    } else {
      setActiveTab('adjustment');
    }
  }, [location.search]);

  useEffect(() => {
    loadProjects();
    loadAdjustments();
    loadTotalBudget();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      if (response.data.success) {
        setProjects(response.data.data!.projects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadAdjustments = async () => {
    try {
      const response = await adjustmentAPI.getAll();
      if (response.data.success) {
        setAdjustments(response.data.data!.adjustments);
      }
    } catch (error) {
      console.error('Failed to load adjustments:', error);
    }
  };

  const loadTotalBudget = async () => {
    try {
      const response = await totalBudgetAPI.get(currentYear);
      if (response.data.success && response.data.data) {
        setTotalBudget(response.data.data.totalAmount);
      }
    } catch (error) {
      console.error('Failed to load total budget:', error);
    }
  };

  const refreshData = () => {
    loadProjects();
    loadAdjustments();
    loadTotalBudget();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>预算管理</Title>
        <Space>
          <Button
            type={activeTab === 'adjustment' ? 'primary' : 'default'}
            icon={<SettingOutlined />}
            onClick={() => setActiveTab('adjustment')}
          >
            预算调整
          </Button>
          <Button
            type={activeTab === 'transfer' ? 'primary' : 'default'}
            icon={<TransactionOutlined />}
            onClick={() => setActiveTab('transfer')}
          >
            项目转移
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title={`${currentYear}年总预算（万元）`}
              value={totalBudget}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="项目总数"
              value={projects.length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="调整记录数"
              value={adjustments.length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'adjustment',
              label: (
                <span>
                  <SettingOutlined />
                  预算调整
                </span>
              ),
              children: (
                <BudgetAdjustmentContent
                  projects={projects}
                  adjustments={adjustments}
                  totalBudget={totalBudget}
                  currentYear={currentYear}
                  onRefresh={refreshData}
                />
              ),
            },
            {
              key: 'transfer',
              label: (
                <span>
                  <TransactionOutlined />
                  项目转移
                </span>
              ),
              children: <ProjectTransferContent onRefresh={refreshData} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default BudgetManagement;