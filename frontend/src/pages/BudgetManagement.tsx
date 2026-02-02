import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  SettingOutlined,
} from '@ant-design/icons';
import { projectAPI, adjustmentAPI, totalBudgetAPI } from '../services/api';
import { Project, BudgetAdjustment as BudgetAdjustmentType } from '../types';
import BudgetAdjustmentContent from '../components/BudgetAdjustmentContent';

const { Title } = Typography;

const BudgetManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [adjustments, setAdjustments] = useState<BudgetAdjustmentType[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('adjustment');

  const currentYear = '2026';

  useEffect(() => {
    loadProjects();
    loadAdjustments();
    loadTotalBudget();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll({ year: currentYear, limit: 1000 });
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
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => setActiveTab('adjustment')}
        >
          预算调整
        </Button>
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
        <BudgetAdjustmentContent
          projects={projects}
          adjustments={adjustments}
          totalBudget={totalBudget}
          currentYear={currentYear}
          onRefresh={refreshData}
        />
      </Card>
    </div>
  );
};

export default BudgetManagement;