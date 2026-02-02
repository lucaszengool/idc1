import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Tag, DatePicker, Select, Space, Button, message, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { executionAPI } from '../services/api';
import { BudgetExecution } from '../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ExecutionHistory: React.FC = () => {
  const [executions, setExecutions] = useState<BudgetExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    projectId: undefined as number | undefined,
    startDate: '',
    endDate: '',
  });

  // 获取当前用户信息
  const currentUsername = localStorage.getItem('username') || '';
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canDelete = currentUsername === 'yangwenyu' || currentUser.username === 'yangwenyu' ||
                    currentUsername === '杨雯宇' || currentUser.displayName === '杨雯宇';

  useEffect(() => {
    loadExecutions();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === '' || params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await executionAPI.getAll(params);
      if (response.data.success && response.data.data) {
        setExecutions(response.data.data.executions);
        setPagination(prev => ({
          ...prev,
          total: response.data.data!.totalCount,
        }));
      }
    } catch (error) {
      console.error('Failed to load executions:', error);
      setExecutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    console.log('Delete execution button clicked for ID:', id);
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条执行记录吗？此操作不可撤销。',
      okText: '删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        console.log('Delete execution confirmed for ID:', id);
        try {
          console.log('Calling executionAPI.delete...');
          const response = await executionAPI.delete(id);
          console.log('Delete execution response:', response);
          message.success('执行记录删除成功');
          await loadExecutions();
        } catch (error: any) {
          console.error('Delete execution error:', error);
          message.error(error.response?.data?.message || '删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: ['executionProject', 'projectName'],
      key: 'projectName',
      render: (name: string, record: any) =>
        name || record.executionProject?.projectName || record.project?.projectName || '未知项目',
    },
    {
      title: '项目分类',
      dataIndex: ['executionProject', 'category'],
      key: 'category',
      render: (category: string) => category ? (
        <Tag color={
          category === 'IDC-架构研发' ? 'blue' :
          category === '高校合作' ? 'green' : 'orange'
        }>
          {category}
        </Tag>
      ) : '-',
    },
    {
      title: '执行金额（万元）',
      dataIndex: 'executionAmount',
      key: 'executionAmount',
      render: (amount: number | string) => `¥${parseFloat(String(amount || 0)).toFixed(2)}`,
    },
    {
      title: '执行情况',
      dataIndex: 'executionStatus',
      key: 'executionStatus',
      render: (status: string) => (
        <Tag color="blue">{status}</Tag>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: BudgetExecution) => (
        canDelete ? (
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
            size="small"
          >
            删除
          </Button>
        ) : (
          <span style={{ color: '#999' }}>无权限</span>
        )
      ),
    },
  ];

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: pagination.total,
    });
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setFilters(prev => ({
      ...prev,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    }));
  };

  return (
    <div>
      <Title level={2}>执行历史</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            onChange={handleDateRangeChange}
          />
          <Button
            icon={<SearchOutlined />}
            onClick={loadExecutions}
          >
            搜索
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={executions}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default ExecutionHistory;