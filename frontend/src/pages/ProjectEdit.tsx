import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import ProjectForm from '../components/ProjectForm';

const ProjectEdit: React.FC = () => {
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

  const handleSuccess = () => {
    navigate(`/projects/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>项目不存在</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/projects/${id}`)}
        >
          返回项目详情
        </Button>
      </div>

      <ProjectForm
        project={project}
        mode="edit"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProjectEdit;