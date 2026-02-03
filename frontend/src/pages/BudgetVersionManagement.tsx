import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Upload,
  Form,
  Input,
  InputNumber,
  Modal,
  List,
  Badge,
  Tag,
  message,
  Popconfirm,
  Image
} from 'antd';
import {
  UploadOutlined,
  FileImageOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  FilePptOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { budgetVersionAPI } from '../services/api';

const { Title, Text } = Typography;

// 运行时检测后端 URL（用于静态文件访问）
const getBackendUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('railway.app')) {
    return 'https://faithful-laughter-production.up.railway.app';
  }
  return 'http://localhost:3001';
};
const API_BASE_URL = getBackendUrl();

const BudgetVersionManagement: React.FC = () => {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [form] = Form.useForm();

  const currentYear = new Date().getFullYear().toString();
  const currentUsername = localStorage.getItem('username') || '';
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // 只有杨雯宇可以上传和删除
  const canManage = currentUsername === 'yangwenyu' || currentUser.username === 'yangwenyu' ||
                     currentUsername === '杨雯宇' || currentUser.displayName === '杨雯宇';

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await budgetVersionAPI.getAll({ budgetYear: currentYear });
      if (response.data.success && response.data.data) {
        setVersions(response.data.data.versions);
      }
    } catch (error) {
      console.error('加载预算版本失败:', error);
      message.error('加载预算版本失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('versionName', values.versionName);
      formData.append('budgetYear', currentYear);
      formData.append('description', values.description || '');
      formData.append('totalBudget', values.totalBudget || '');
      formData.append('uploadedBy', currentUsername || 'yangwenyu');

      // values.file is now directly the fileList array due to getValueFromEvent
      if (values.file && values.file.length > 0) {
        formData.append('file', values.file[0].originFileObj);
      }

      const response = await budgetVersionAPI.create(formData);
      if (response.data.success) {
        message.success('预算版本上传成功！');
        setIsUploadModalVisible(false);
        form.resetFields();
        loadVersions();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      message.error(error.response?.data?.message || '上传失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await budgetVersionAPI.delete(id);
      message.success('删除成功');
      loadVersions();
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  const handleSetActive = async (id: number) => {
    try {
      await budgetVersionAPI.setActive(id);
      message.success('已设置为当前版本');
      loadVersions();
    } catch (error: any) {
      message.error(error.response?.data?.message || '设置失败');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('powerpoint') || fileType.includes('ppt')) {
      return <FilePptOutlined style={{ fontSize: 24, color: '#d04423' }} />;
    } else if (fileType.includes('pdf')) {
      return <FilePdfOutlined style={{ fontSize: 24, color: '#f40f02' }} />;
    } else {
      return <FileImageOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3}>预算版本管理</Title>
          <Text type="secondary">查看和管理不同版本的预算文件</Text>
        </div>
        {canManage && (
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setIsUploadModalVisible(true)}
          >
            上传新版本
          </Button>
        )}
      </div>

      {!canManage && (
        <Card style={{ marginBottom: 16, background: '#fffbe6', borderColor: '#ffe58f' }}>
          <Text>只有管理员（杨雯宇）可以上传和管理预算版本</Text>
        </Card>
      )}

      <List
        loading={loading}
        dataSource={versions}
        renderItem={(version: any) => (
          <Card
            style={{ marginBottom: 16 }}
            extra={
              version.isActive && (
                <Badge status="success" text="当前版本" />
              )
            }
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, background: '#f5f5f5', borderRadius: 8 }}>
                {getFileIcon(version.fileType)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div>
                    <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                      {version.versionName}
                      {version.isActive && (
                        <Tag color="green" style={{ marginLeft: 8 }}>激活</Tag>
                      )}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      上传于 {new Date(version.createdAt).toLocaleString()} · 上传人: {version.uploadedBy}
                    </Text>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      type="link"
                      icon={<FileImageOutlined />}
                      onClick={() => window.open(`${API_BASE_URL}${version.fileUrl}`, '_blank')}
                    >
                      查看文件
                    </Button>

                    {canManage && !version.isActive && (
                      <Button
                        type="link"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleSetActive(version.id)}
                      >
                        设为当前版本
                      </Button>
                    )}

                    {canManage && (
                      <Popconfirm
                        title="确定删除此版本？"
                        onConfirm={() => handleDelete(version.id)}
                        okText="删除"
                        cancelText="取消"
                      >
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                </div>

                {version.description && (
                  <Text style={{ display: 'block', marginTop: 8 }}>{version.description}</Text>
                )}

                {version.totalBudget && (
                  <Text strong style={{ display: 'block', marginTop: 8, color: '#1890ff' }}>
                    总预算: ¥{parseFloat(version.totalBudget).toFixed(2)}万元
                  </Text>
                )}

                <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 12 }}>
                  文件名: {version.fileName}
                </Text>
              </div>
            </div>
          </Card>
        )}
        locale={{ emptyText: '暂无预算版本' }}
      />

      <Modal
        title="上传新预算版本"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleUpload} layout="vertical">
          <Form.Item
            label="版本名称"
            name="versionName"
            rules={[{ required: true, message: '请输入版本名称' }]}
          >
            <Input placeholder="例如：2026年第1版" />
          </Form.Item>

          <Form.Item
            label="总预算（万元）"
            name="totalBudget"
          >
            <InputNumber
              style={{ width: '100%' }}
              precision={2}
              min={0}
              placeholder="输入该版本的总预算"
            />
          </Form.Item>

          <Form.Item
            label="版本描述"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="描述此版本的主要变化和说明"
            />
          </Form.Item>

          <Form.Item
            label="上传文件"
            name="file"
            rules={[{ required: true, message: '请上传预算文件' }]}
            extra="支持 PPT, PPTX, PDF, JPG, PNG 格式，最大50MB"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept=".ppt,.pptx,.pdf,.jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsUploadModalVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              上传
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BudgetVersionManagement;
