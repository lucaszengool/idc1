import React from 'react';
import { Form, Input, Select, InputNumber, Button, Card, message } from 'antd';
import { projectAPI } from '../services/api';
import { Project } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSuccess,
  mode = 'create'
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      console.log('ProjectForm onFinish called with values:', values);
      console.log('Mode:', mode);

      if (mode === 'create') {
        console.log('Calling projectAPI.create...');

        // 处理项目名称的tags模式 - 取第一个值
        const processedValues = {
          ...values,
          projectName: Array.isArray(values.projectName) ? values.projectName[0] : values.projectName
        };

        console.log('Processed values:', processedValues);
        const response = await projectAPI.create(processedValues);
        console.log('Create response:', response);
        message.success('项目创建成功！');
        form.resetFields();
      } else {
        console.log('Calling projectAPI.update...');
        const response = await projectAPI.update(project!.id, values);
        console.log('Update response:', response);
        message.success('项目更新成功！');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('ProjectForm error:', error);
      console.error('Error response:', error.response);

      if (error.response?.status === 401) {
        message.error('认证失败，请重新登录后重试');
      } else if (error.response?.status === 403) {
        message.error('权限不足，无法执行此操作');
      } else if (error.response?.status === 400) {
        message.error(error.response?.data?.message || '请求参数错误');
      } else if (error.response?.status === 500) {
        message.error('服务器错误，请稍后重试');
      } else {
        message.error(error.response?.data?.message || `操作失败: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={mode === 'create' ? '创建新项目' : '编辑项目'}>
      <Form
        form={form}
        layout="vertical"
        initialValues={project}
        onFinish={onFinish}
      >
        <Form.Item
          name="category"
          label="项目分类"
          rules={[{ required: true, message: '请选择项目分类' }]}
        >
          <Select placeholder="请选择项目分类">
            <Option value="IDC-架构研发">IDC-架构研发</Option>
            <Option value="高校合作">高校合作</Option>
            <Option value="IDC运营-研发">IDC运营-研发</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="projectName"
          label="项目名称"
          rules={[{ required: true, message: '请选择或输入项目名称' }]}
        >
          <Select
            mode="tags"
            placeholder="请选择或输入项目名称"
            showSearch
            allowClear
            maxTagCount={1}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            dropdownRender={(menu) => (
              <div>
                {menu}
                <div style={{ padding: 8, color: '#666', fontSize: '12px' }}>
                  可选择常用项目名称或直接输入新名称
                </div>
              </div>
            )}
          >
            <Option value="IDC运营平台">IDC运营平台</Option>
            <Option value="架构管理系统">架构管理系统</Option>
            <Option value="预算管理系统">预算管理系统</Option>
            <Option value="自动化运维平台">自动化运维平台</Option>
            <Option value="监控告警系统">监控告警系统</Option>
            <Option value="容器云平台">容器云平台</Option>
            <Option value="数据中心建设">数据中心建设</Option>
            <Option value="高校合作项目">高校合作项目</Option>
            <Option value="技术架构升级">技术架构升级</Option>
            <Option value="安全防护系统">安全防护系统</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="subProjectName"
          label="子项目名称"
          rules={[{ required: true, message: '请输入子项目名称' }]}
        >
          <Input placeholder="请输入子项目名称" />
        </Form.Item>

        <Form.Item
          name="owner"
          label="项目负责人"
          rules={[{ required: true, message: '请输入项目负责人' }]}
        >
          <Input placeholder="请输入项目负责人" />
        </Form.Item>

        <Form.Item
          name="budgetAmount"
          label="26年预算金额（万元）"
          rules={[
            { required: true, message: '请输入预算金额' },
            { type: 'number', min: 0, message: '预算金额不能为负数' }
          ]}
        >
          <InputNumber
            placeholder="请输入预算金额"
            style={{ width: '100%' }}
            precision={2}
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="项目内容描述"
          rules={[{ required: true, message: '请输入项目内容描述' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述项目内容"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            {mode === 'create' ? '创建项目' : '更新项目'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProjectForm;