import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';

const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/projects/list');
  };

  return (
    <div>
      <ProjectForm mode="create" onSuccess={handleSuccess} />
    </div>
  );
};

export default ProjectCreate;