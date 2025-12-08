import React, { useEffect, useState } from 'react';
import { Form, Select, InputNumber, Input, Button, Upload, Card, message, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { projectAPI, executionAPI } from '../services/api';
import { Project } from '../types';

const { Option } = Select;
const { TabPane } = Tabs;

const ExecutionReport: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2025');

  useEffect(() => {
    loadProjects();
  }, [selectedYear]);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAll({ year: selectedYear, limit: 1000 }); // Get projects for selected year
      if (response.data.success && response.data.data) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      message.error('加载项目列表失败');
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedProject(null);
    form.resetFields();
  };

  const handleProjectChange = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
    // Reset execution status and amount when project changes
    form.setFieldsValue({
      executionStatus: undefined,
      executionAmount: undefined
    });
  };

  const handleExecutionStatusChange = (status: string) => {
    if (!selectedProject) return;

    const totalBudget = parseFloat(String(selectedProject.budgetOccupied || selectedProject.budgetAmount || 0));
    let percentage = 0;

    // Calculate percentage based on status
    switch(status) {
      case '合同签订付款20%':
        percentage = 0.20;
        break;
      case '方案设计60%':
        percentage = 0.60;
        break;
      case '样机测试完成20%':
        percentage = 0.20;
        break;
    }

    const calculatedAmount = totalBudget * percentage;
    form.setFieldsValue({
      executionAmount: parseFloat(calculatedAmount.toFixed(2))
    });
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('projectId', values.projectId.toString());
      formData.append('executionAmount', values.executionAmount.toString());
      formData.append('executionStatus', values.executionStatus);
      formData.append('createdBy', values.createdBy);

      if (values.voucher && values.voucher.fileList && values.voucher.fileList.length > 0) {
        formData.append('voucher', values.voucher.fileList[0].originFileObj);
      }

      await executionAPI.create(formData);
      message.success('执行记录提交成功！');
      form.resetFields();
      setSelectedProject(null);
    } catch (error: any) {
      message.error(error.response?.data?.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent automatic upload
    maxCount: 1,
    accept: '.jpg,.jpeg,.png,.pdf',
  };

  return (
    <Card title="预算执行填报">
      <Tabs
        activeKey={selectedYear}
        onChange={handleYearChange}
        style={{ marginBottom: 16 }}
      >
        <TabPane tab="2025年" key="2025" />
        <TabPane tab="2026年" key="2026" />
      </Tabs>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="projectId"
          label="选择项目"
          rules={[{ required: true, message: '请选择项目' }]}
        >
          <Select
            placeholder="请选择项目"
            showSearch
            optionFilterProp="children"
            onChange={handleProjectChange}
          >
            {projects.map(project => (
              <Option key={project.id} value={project.id}>
                {project.projectName} - {project.subProjectName} ({project.owner})
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedProject && (
          <div style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 6,
            padding: 16,
            marginBottom: 16,
          }}>
            <h4 style={{ marginBottom: 12, color: '#52c41a' }}>项目信息</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              <p style={{ margin: '4px 0' }}><strong>项目分类：</strong>{selectedProject.category}</p>
              <p style={{ margin: '4px 0' }}><strong>负责人：</strong>{selectedProject.owner}</p>
              <p style={{ margin: '4px 0' }}><strong>项目名称：</strong>{selectedProject.projectName}</p>
              <p style={{ margin: '4px 0' }}><strong>子项目：</strong>{selectedProject.subProjectName}</p>
            </div>
            <div style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #d9f7be',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px 16px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>总预算</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                  ¥{parseFloat(String(selectedProject.budgetOccupied || selectedProject.budgetAmount || 0)).toFixed(2)}万
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>已执行</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                  ¥{parseFloat(String(selectedProject.budgetExecuted || selectedProject.executedAmount || 0)).toFixed(2)}万
                  <span style={{ fontSize: '12px', marginLeft: 4, color: '#999' }}>
                    ({((parseFloat(String(selectedProject.budgetExecuted || 0)) / parseFloat(String(selectedProject.budgetOccupied || 1))) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>剩余预算</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
                  ¥{parseFloat(String(selectedProject.remainingBudget || ((parseFloat(String(selectedProject.budgetOccupied || 0)) - parseFloat(String(selectedProject.budgetExecuted || 0)))))).toFixed(2)}万
                </div>
              </div>
            </div>
          </div>
        )}

        <Form.Item
          name="executionStatus"
          label="执行情况"
          rules={[{ required: true, message: '请选择执行情况' }]}
        >
          <Select
            placeholder="请选择执行情况"
            onChange={handleExecutionStatusChange}
          >
            <Option value="合同签订付款20%">合同签订付款20%</Option>
            <Option value="方案设计60%">方案设计60%</Option>
            <Option value="样机测试完成20%">样机测试完成20%</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="executionAmount"
          label="本期执行金额（万元）"
          rules={[
            { required: true, message: '请先选择执行情况以计算金额' },
            { type: 'number', min: 0.01, message: '执行金额必须大于0' }
          ]}
        >
          <InputNumber
            placeholder="选择执行情况后自动计算"
            style={{ width: '100%' }}
            precision={2}
            min={0.01}
            addonAfter="万元"
            disabled
            readOnly
          />
        </Form.Item>

        <Form.Item
          name="createdBy"
          label="填报人"
          rules={[{ required: true, message: '请输入填报人姓名' }]}
        >
          <Input placeholder="请输入填报人姓名" />
        </Form.Item>

        <Form.Item
          name="voucher"
          label="执行凭证"
          help="支持上传jpg、jpeg、png、pdf格式文件，最大5MB"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>上传凭证</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            提交执行记录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ExecutionReport;