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
      
      if (mode === 'create') {
        await projectAPI.create(values);
        message.success('项目创建成功！');
        form.resetFields();
      } else {
        await projectAPI.update(project!.id, values);
        message.success('项目更新成功！');
      }
      
      onSuccess?.();
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败，请重试');
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
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
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