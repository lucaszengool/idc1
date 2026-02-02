import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectAPI } from '../services/api';

const { Title } = Typography;

interface OwnerData {
  owner: string;
  projectCount: number;
  totalBudget: number;
  executedAmount: number;
  remainingBudget: number;
  executionRate: number;
  projects: Array<{
    id: number;
    projectName: string;
    subProjectName: string;
    category: string;
    budgetAmount: number;
    executedAmount: number;
    executionRate: number;
  }>;
}

const StatisticsByOwner: React.FC = () => {
  const [ownerData, setOwnerData] = useState<OwnerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOwnerStatistics();
  }, []);

  const loadOwnerStatistics = async () => {
    try {
      setLoading(true);
      
      // Get all projects grouped by owner
      const projectResponse = await projectAPI.getAll({ limit: 1000, year: '2026' });
      if (projectResponse.data.success && projectResponse.data.data) {
        const projects = projectResponse.data.data.projects;
        
        // Group projects by owner
        const ownerMap = new Map<string, OwnerData>();
        
        projects.forEach((project: any) => {
          const owner = project.owner;
          const budgetAmount = parseFloat(String(project.budgetAmount));
          const executedAmount = parseFloat(String(project.executedAmount || 0));
          const remainingBudget = budgetAmount - executedAmount;
          const executionRate = budgetAmount > 0 ? (executedAmount / budgetAmount) * 100 : 0;
          
          if (!ownerMap.has(owner)) {
            ownerMap.set(owner, {
              owner,
              projectCount: 0,
              totalBudget: 0,
              executedAmount: 0,
              remainingBudget: 0,
              executionRate: 0,
              projects: [],
            });
          }
          
          const ownerStats = ownerMap.get(owner)!;
          ownerStats.projectCount += 1;
          ownerStats.totalBudget += budgetAmount;
          ownerStats.executedAmount += executedAmount;
          ownerStats.remainingBudget += remainingBudget;
          ownerStats.projects.push({
            id: project.id,
            projectName: project.projectName,
            subProjectName: project.subProjectName || '',
            category: project.category,
            budgetAmount,
            executedAmount,
            executionRate,
          });
        });
        
        // Calculate execution rates for each owner
        ownerMap.forEach((stats) => {
          stats.executionRate = stats.totalBudget > 0 
            ? (stats.executedAmount / stats.totalBudget) * 100 
            : 0;
        });
        
        setOwnerData(Array.from(ownerMap.values()));
      }
    } catch (error) {
      console.error('Failed to load owner statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const pieData = ownerData.map(item => ({
    name: item.owner,
    value: item.totalBudget,
  }));

  const barData = ownerData.map(item => ({
    owner: item.owner,
    项目数量: item.projectCount,
    总预算: item.totalBudget,
    已执行: item.executedAmount,
    剩余预算: item.remainingBudget,
  }));

  const ownerColumns = [
    {
      title: '项目负责人',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner: string) => (
        <Tag color="blue">
          {owner}
        </Tag>
      ),
    },
    {
      title: '项目数量',
      dataIndex: 'projectCount',
      key: 'projectCount',
      render: (count: number) => `${count} 个`,
      sorter: (a: OwnerData, b: OwnerData) => a.projectCount - b.projectCount,
    },
    {
      title: '总预算（万元）',
      dataIndex: 'totalBudget',
      key: 'totalBudget',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: OwnerData, b: OwnerData) => a.totalBudget - b.totalBudget,
    },
    {
      title: '已执行（万元）',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: OwnerData, b: OwnerData) => a.executedAmount - b.executedAmount,
    },
    {
      title: '剩余预算（万元）',
      dataIndex: 'remainingBudget',
      key: 'remainingBudget',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: OwnerData, b: OwnerData) => a.remainingBudget - b.remainingBudget,
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number) => (
        <Tag color={rate > 80 ? 'red' : rate > 50 ? 'orange' : 'green'}>
          {rate.toFixed(1)}%
        </Tag>
      ),
      sorter: (a: OwnerData, b: OwnerData) => a.executionRate - b.executionRate,
    },
  ];

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '子项目名称',
      dataIndex: 'subProjectName',
      key: 'subProjectName',
    },
    {
      title: '项目分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={
          category === 'IDC-架构研发' ? 'blue' : 
          category === '高校合作' ? 'green' : 'orange'
        }>
          {category}
        </Tag>
      ),
    },
    {
      title: '预算金额（万元）',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '已执行（万元）',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate: number) => (
        <Tag color={rate > 80 ? 'red' : rate > 50 ? 'orange' : 'green'}>
          {rate.toFixed(1)}%
        </Tag>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>负责人统计</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {ownerData.map((owner, index) => (
          <Col span={8} key={owner.owner}>
            <Card>
              <Statistic
                title={owner.owner}
                value={owner.totalBudget}
                precision={2}
                suffix="万元"
                valueStyle={{ color: COLORS[index % COLORS.length] }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#666' }}>
                  {owner.projectCount}个项目 | 执行率{owner.executionRate.toFixed(1)}%
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="各负责人预算分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`¥${parseFloat(String(value)).toFixed(2)}万`, '预算金额']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="各负责人预算执行对比">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="owner" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="总预算" fill="#8884d8" />
                <Bar dataKey="已执行" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 负责人详细统计表 */}
      <Card title="负责人统计详情" style={{ marginBottom: 24 }}>
        <Table
          columns={ownerColumns}
          dataSource={ownerData}
          pagination={false}
          rowKey="owner"
        />
      </Card>

      {/* 各负责人项目详情 */}
      {ownerData.map((owner) => (
        <Card 
          key={owner.owner} 
          title={`${owner.owner} - 项目明细`}
          style={{ marginBottom: 24 }}
        >
          <Table
            columns={projectColumns}
            dataSource={owner.projects}
            pagination={{ pageSize: 5 }}
            rowKey="id"
            size="small"
          />
        </Card>
      ))}
    </div>
  );
};

export default StatisticsByOwner;