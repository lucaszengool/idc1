import { Model, Optional } from 'sequelize';
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
interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {
}
declare class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    id: number;
    category: string;
    projectName: string;
    subProjectName: string;
    owner: string;
    budgetAmount: number;
    content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Project;
//# sourceMappingURL=Project.d.ts.map