import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Row,
  Col,
  Card,
  Statistic,
  Divider,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { adjustmentAPI, totalBudgetAPI } from '../services/api';
import { Project, BudgetAdjustment as BudgetAdjustmentType } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface BudgetAdjustmentContentProps {
  projects: Project[];
  adjustments: BudgetAdjustmentType[];
  totalBudget: number;
  currentYear: string;
  onRefresh: () => void;
}

const BudgetAdjustmentContent: React.FC<BudgetAdjustmentContentProps> = ({
  projects,
  adjustments,
  totalBudget,
  currentYear,
  onRefresh
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTotalBudgetModalVisible, setIsTotalBudgetModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [totalBudgetForm] = Form.useForm();

  // Get user object to check displayName
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentDisplayName = currentUser?.displayName || '';

  const handleProjectSelect = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
  };

  const handleSubmit = async (values: any) => {
    if (!selectedProject) {
      message.error('请选择原项目');
      return;
    }

    setLoading(true);
    try {
      const adjustmentData = {
        originalProjectId: selectedProject.id,
        newProjectName: values.newProjectName,
        adjustmentReason: values.adjustmentReason,
        adjustmentAmount: values.adjustmentAmount,
        targetCategory: values.targetCategory,
        targetProject: values.targetProject,
        targetSubProject: values.targetSubProject || '',
        targetOwner: values.targetOwner,
      };

      const response = await adjustmentAPI.create(adjustmentData);
      if (response.data.success) {
        message.success('预算调整创建成功，项目预算已更新');
        form.resetFields();
        setSelectedProject(null);
        setIsModalVisible(false);
        onRefresh();

        setTimeout(() => {
          message.info('所有相关数据已同步更新，可查看Dashboard查看最新数据');
        }, 1000);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '预算调整创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTotalBudgetUpdate = async (values: any) => {
    setLoading(true);
    try {
      const response = await totalBudgetAPI.update(currentYear, values.totalAmount);
      if (response.data.success) {
        message.success('总预算更新成功');
        setIsTotalBudgetModalVisible(false);
        totalBudgetForm.resetFields();
        onRefresh();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '总预算更新失败');
    } finally {
      setLoading(false);
    }
  };

  const adjustmentColumns = [
    {
      title: '调整日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '原项目',
      dataIndex: ['originalProject', 'projectName'],
      key: 'originalProject',
    },
    {
      title: '新项目名称',
      dataIndex: 'newProjectName',
      key: 'newProjectName',
    },
    {
      title: '调整金额（万元）',
      dataIndex: 'adjustmentAmount',
      key: 'adjustmentAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '目标类别',
      dataIndex: 'targetCategory',
      key: 'targetCategory',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '调整原因',
      dataIndex: 'adjustmentReason',
      key: 'adjustmentReason',
      ellipsis: true,
    },
    {
      title: '目标负责人',
      dataIndex: 'targetOwner',
      key: 'targetOwner',
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          {currentDisplayName === '杨雯宇' && (
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => {
                totalBudgetForm.setFieldsValue({ totalAmount: totalBudget });
                setIsTotalBudgetModalVisible(true);
              }}
              style={{ marginRight: 8 }}
            >
              编辑总预算
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            新增预算调整
          </Button>
        </div>
      </div>

      <Table
        columns={adjustmentColumns}
        dataSource={adjustments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="新增预算调整"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedProject(null);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="选择原项目"
            name="originalProjectId"
            rules={[{ required: true, message: '请选择原项目' }]}
          >
            <Select
              placeholder="选择要调整预算的项目"
              onChange={handleProjectSelect}
              showSearch
              filterOption={(input, option: any) => {
                return String(option?.children || '').toLowerCase().includes(input.toLowerCase());
              }}
            >
              {projects.map(project => (
                <Option key={project.id} value={project.id}>
                  {project.projectName} (剩余: ¥{project.remainingBudget?.toFixed(2) || '0.00'}万)
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedProject && (
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="预算占用"
                    value={selectedProject.budgetOccupied}
                    precision={2}
                    suffix="万元"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="已执行"
                    value={selectedProject.budgetExecuted}
                    precision={2}
                    suffix="万元"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="可调整余额"
                    value={selectedProject.remainingBudget}
                    precision={2}
                    suffix="万元"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="新项目名称"
                name="newProjectName"
                rules={[{ required: true, message: '请输入新项目名称' }]}
              >
                <Input placeholder="输入新项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="调整金额（万元）"
                name="adjustmentAmount"
                rules={[
                  { required: true, message: '请输入调整金额' },
                  {
                    validator: (_, value) => {
                      if (selectedProject && value > selectedProject.remainingBudget) {
                        return Promise.reject('调整金额不能超过项目剩余预算');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <InputNumber
                  min={0}
                  max={selectedProject?.remainingBudget || 0}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="输入调整金额"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="目标类别"
                name="targetCategory"
                rules={[{ required: true, message: '请选择目标类别' }]}
              >
                <Select placeholder="选择目标类别">
                  <Option value="IDC-架构研发">IDC-架构研发</Option>
                  <Option value="高校合作">高校合作</Option>
                  <Option value="IDC运营-研发">IDC运营-研发</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="目标负责人"
                name="targetOwner"
                rules={[{ required: true, message: '请输入目标负责人' }]}
              >
                <Input placeholder="输入目标负责人" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="目标项目"
                name="targetProject"
                rules={[{ required: true, message: '请输入目标项目' }]}
              >
                <Input placeholder="输入目标项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="目标子项目"
                name="targetSubProject"
              >
                <Input placeholder="输入目标子项目名称（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="调整原因"
            name="adjustmentReason"
            rules={[{ required: true, message: '请输入调整原因' }]}
          >
            <TextArea rows={4} placeholder="请详细说明预算调整的原因" />
          </Form.Item>

          <Divider />

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              创建调整
            </Button>
          </div>
        </Form>
      </Modal>

      {currentDisplayName === '杨雯宇' && (
        <Modal
          title={`编辑${currentYear}年总预算`}
          open={isTotalBudgetModalVisible}
          onCancel={() => {
            setIsTotalBudgetModalVisible(false);
            totalBudgetForm.resetFields();
          }}
          footer={null}
        >
          <Form form={totalBudgetForm} onFinish={handleTotalBudgetUpdate} layout="vertical">
            <Form.Item
              label="总预算金额（万元）"
              name="totalAmount"
              rules={[
                { required: true, message: '请输入总预算金额' },
                { type: 'number', min: 0, message: '总预算必须大于0' }
              ]}
            >
              <InputNumber
                min={0}
                precision={2}
                style={{ width: '100%' }}
                placeholder="输入总预算金额"
              />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button
                onClick={() => setIsTotalBudgetModalVisible(false)}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                更新总预算
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default BudgetAdjustmentContent;