-- Create the database
CREATE DATABASE dcops_budget;

-- Connect to the database
\c dcops_budget;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL CHECK (category IN ('IDC-架构研发', '高校合作', 'IDC运营-研发')),
  project_name VARCHAR(255) NOT NULL,
  sub_project_name VARCHAR(255) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  budget_amount DECIMAL(12, 2) NOT NULL CHECK (budget_amount >= 0),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_executions table
CREATE TABLE IF NOT EXISTS budget_executions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  execution_amount DECIMAL(12, 2) NOT NULL CHECK (execution_amount > 0),
  execution_date DATE NOT NULL,
  description TEXT NOT NULL,
  voucher_url VARCHAR(500),
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_adjustments table
CREATE TABLE IF NOT EXISTS budget_adjustments (
  id SERIAL PRIMARY KEY,
  original_project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  new_project_name VARCHAR(255) NOT NULL,
  adjustment_reason TEXT NOT NULL,
  adjustment_amount DECIMAL(12, 2) NOT NULL CHECK (adjustment_amount > 0),
  target_category VARCHAR(50) NOT NULL CHECK (target_category IN ('IDC-架构研发', '高校合作', 'IDC运营-研发')),
  target_project VARCHAR(255) NOT NULL,
  target_sub_project VARCHAR(255) NOT NULL,
  target_owner VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_owner ON projects(owner);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_budget_executions_project_id ON budget_executions(project_id);
CREATE INDEX idx_budget_executions_execution_date ON budget_executions(execution_date);
CREATE INDEX idx_budget_executions_created_at ON budget_executions(created_at);

CREATE INDEX idx_budget_adjustments_original_project_id ON budget_adjustments(original_project_id);
CREATE INDEX idx_budget_adjustments_created_at ON budget_adjustments(created_at);

-- Insert sample data for testing
INSERT INTO projects (category, project_name, sub_project_name, owner, budget_amount, content) VALUES
('IDC-架构研发', 'AI平台架构优化', '深度学习框架升级', '张三', 500.00, '优化现有AI平台架构，提升深度学习框架性能和稳定性'),
('高校合作', '清华大学联合研发', '智能算法研究', '李四', 800.00, '与清华大学合作开展智能算法研究，推进产学研一体化'),
('IDC运营-研发', '数据中心监控系统', '实时监控模块', '王五', 300.00, '开发数据中心实时监控系统，提升运营效率和稳定性'),
('IDC-架构研发', '云计算平台扩容', '容器化部署', '赵六', 1200.00, '扩容云计算平台，实现大规模容器化部署能力'),
('高校合作', '北京理工联合项目', '机器学习算法', '钱七', 600.00, '与北京理工大学合作开发先进机器学习算法');

-- Insert sample execution data
INSERT INTO budget_executions (project_id, execution_amount, execution_date, description, created_by) VALUES
(1, 150.00, '2024-09-01', '购买GPU服务器用于深度学习训练', '张三'),
(1, 80.00, '2024-09-15', '软件许可证费用', '张三'),
(2, 200.00, '2024-08-20', '合作研究设备采购', '李四'),
(3, 100.00, '2024-09-10', '监控系统开发工具采购', '王五'),
(4, 300.00, '2024-08-25', '云服务器扩容费用', '赵六');

-- Insert sample adjustment data
INSERT INTO budget_adjustments (original_project_id, new_project_name, adjustment_reason, adjustment_amount, target_category, target_project, target_sub_project, target_owner) VALUES
(1, 'AI平台架构优化-紧急升级', '需要紧急处理性能瓶颈问题', 100.00, 'IDC-架构研发', 'AI平台紧急优化', '性能瓶颈解决', '张三');