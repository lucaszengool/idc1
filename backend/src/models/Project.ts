import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProjectAttributes {
  id: number;
  category: string;
  projectName: string;
  subProjectName: string;
  owner: string;
  budgetAmount: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public category!: string;
  public projectName!: string;
  public subProjectName!: string;
  public owner!: string;
  public budgetAmount!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: DataTypes.ENUM('IDC-架构研发', '高校合作', 'IDC运营-研发'),
    allowNull: false,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subProjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  budgetAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects',
  timestamps: true,
});

export default Project;