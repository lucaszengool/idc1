import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, Select, Card, message, Modal, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import { safeToFixed, formatCurrency, safeParseFloat } from '../utils/number';

const { Search } = Input;
const { Option } = Select;

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    owner: '',
  });

  useEffect(() => {
    loadProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filters]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === '') {
          delete params[key as keyof typeof params];
        }
      });

      const response = await projectAPI.getAll(params);
      if (response.data.success && response.data.data) {
        setProjects(response.data.data.projects);
        setPagination(prev => ({
          ...prev,
          total: response.data.data!.totalCount,
        }));
      }
    } catch (error: any) {
      message.error('加载项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('Delete button clicked for project ID:', id);

    // 检查用户是否已登录
    const accessKey = localStorage.getItem('accessKey');
    const user = localStorage.getItem('user');

    console.log('Auth check - accessKey exists:', !!accessKey, 'user exists:', !!user);

    if (!accessKey || !user) {
      console.log('User not logged in');
      message.error('请先登录');
      navigate('/login');
      return;
    }

    console.log('User is logged in, proceeding with delete');

    try {
      console.log('Calling projectAPI.delete...');
      const response = await projectAPI.delete(id);
      console.log('Delete response:', response);
      message.success('项目删除成功');
      await loadProjects();
    } catch (error: any) {
      console.error('Delete error details:', error);
      console.error('Error response:', error.response);
      console.error('Error config:', error.config);

      if (error.response?.status === 401) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('accessKey');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.status === 403) {
        message.error('权限不足，只有项目负责人和PM可以删除项目');
      } else if (error.response?.status === 404) {
        message.error('项目不存在');
      } else {
        message.error(error.response?.data?.message || `删除失败: ${error.message}`);
      }
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: pagination.total,
    });
  };

  const columns = [
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
      filters: [
        { text: 'IDC-架构研发', value: 'IDC-架构研发' },
        { text: '高校合作', value: '高校合作' },
        { text: 'IDC运营-研发', value: 'IDC运营-研发' },
      ],
    },
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
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '预算金额（万元）',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      render: (amount: number | string) => formatCurrency(amount, 2),
      sorter: true,
    },
    {
      title: '已执行（万元）',
      dataIndex: 'executedAmount',
      key: 'executedAmount',
      render: (amount?: number | string) => formatCurrency(amount || 0, 2),
    },
    {
      title: '剩余预算（万元）',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      render: (amount?: number | string) => formatCurrency(amount || 0, 2),
    },
    {
      title: '执行率',
      dataIndex: 'executionRate',
      key: 'executionRate',
      render: (rate?: number) => {
        const safeRate = safeParseFloat(rate);
        return (
          <div>
            <Progress
              percent={safeRate}
              size="small"
              status={safeRate > 80 ? 'exception' : 'active'}
            />
            <span style={{ marginLeft: 8 }}>
              {safeToFixed(safeRate, 1)}%
            </span>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Project) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/projects/${record.id}`)}
            size="small"
          >
            查看
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/projects/${record.id}/edit`)}
            size="small"
          >
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="项目列表"
      extra={
        <Button 
          type="primary" 
          onClick={() => navigate('/projects/create')}
        >
          创建项目
        </Button>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <Search
            placeholder="搜索负责人"
            allowClear
            style={{ width: 200 }}
            onSearch={(value) => setFilters(prev => ({ ...prev, owner: value }))}
          />
          <Select
            placeholder="选择项目分类"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value || '' }))}
          >
            <Option value="IDC-架构研发">IDC-架构研发</Option>
            <Option value="高校合作">高校合作</Option>
            <Option value="IDC运营-研发">IDC运营-研发</Option>
          </Select>
          <Button
            icon={<SearchOutlined />}
            onClick={loadProjects}
          >
            搜索
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={projects}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </Space>
    </Card>
  );
};

export default ProjectList;