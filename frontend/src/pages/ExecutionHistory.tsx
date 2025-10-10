import React, { useEffect, useState } from 'react';
import { Card, Typography, Table, Tag, DatePicker, Select, Space, Button, message, Modal } from 'antd';
import { SearchOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
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
      dataIndex: ['project', 'projectName'],
      key: 'projectName',
    },
    {
      title: '项目分类',
      dataIndex: ['project', 'category'],
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
      title: '执行金额（万元）',
      dataIndex: 'executionAmount',
      key: 'executionAmount',
      render: (amount: number | string) => `¥${(parseFloat(String(amount)) / 10000).toFixed(2)}`,
    },
    {
      title: '执行日期',
      dataIndex: 'executionDate',
      key: 'executionDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '执行说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '凭证',
      dataIndex: 'voucherUrl',
      key: 'voucherUrl',
      render: (url: string) => url ? (
        <Button 
          icon={<FileTextOutlined />} 
          size="small"
          onClick={() => window.open(url, '_blank')}
        >
          查看凭证
        </Button>
      ) : '无',
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
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
          danger
          size="small"
        >
          删除
        </Button>
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