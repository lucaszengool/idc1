import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, message, Tag, Progress } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { projectAPI } from '../services/api';
import { Project } from '../types';

const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(parseInt(id));
    }
  }, [id]);

  const loadProject = async (projectId: number) => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(projectId);
      if (response.data.success && response.data.data) {
        setProject(response.data.data);
      }
    } catch (error: any) {
      message.error('加载项目详情失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>项目不存在</div>;
  }

  const executionRate = project.executionRate || 0;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/projects/list')}
          style={{ marginRight: 8 }}
        >
          返回项目列表
        </Button>
        <Button 
          type="primary"
          icon={<EditOutlined />} 
          onClick={() => navigate(`/projects/${project.id}/edit`)}
        >
          编辑项目
        </Button>
      </div>

      <Card title="项目详情" loading={loading}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="项目分类">
            <Tag color={
              project.category === 'IDC-架构研发' ? 'blue' : 
              project.category === '高校合作' ? 'green' : 'orange'
            }>
              {project.category}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="项目负责人">
            {project.owner}
          </Descriptions.Item>
          <Descriptions.Item label="项目名称">
            {project.projectName}
          </Descriptions.Item>
          <Descriptions.Item label="子项目名称">
            {project.subProjectName || '无'}
          </Descriptions.Item>
          <Descriptions.Item label="预算金额">
            ¥{parseFloat(String(project.budgetAmount)).toFixed(2)}万元
          </Descriptions.Item>
          <Descriptions.Item label="已执行金额">
            ¥{project.executedAmount ? parseFloat(String(project.executedAmount)).toFixed(2) : '0.00'}万元
          </Descriptions.Item>
          <Descriptions.Item label="剩余预算">
            ¥{project.remainingAmount ? parseFloat(String(project.remainingAmount)).toFixed(2) : '0.00'}万元
          </Descriptions.Item>
          <Descriptions.Item label="执行率">
            <div>
              <Progress
                percent={executionRate}
                size="small"
                status={executionRate > 80 ? 'exception' : 'active'}
                style={{ marginBottom: 4 }}
              />
              <span>{parseFloat(String(executionRate)).toFixed(1)}%</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {new Date(project.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间" span={2}>
            {new Date(project.updatedAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="项目内容" span={2}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{project.content}</div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProjectView;