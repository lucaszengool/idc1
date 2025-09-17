import { Model, Optional } from 'sequelize';
interface ProjectAttributes {
    id: number;
    projectCode: string;
    projectName: string;
    projectType: string;
    projectStatus: string;
    owner: string;
    members: string;
    projectGoal: string;
    projectBackground: string;
    projectExplanation: string;
    procurementCode: string;
    completionStatus: string;
    relatedBudgetProject: string;
    budgetYear: number;
    budgetOccupied: number;
    budgetExecuted: number;
    remainingBudget: number;
    orderAmount: number;
    acceptanceAmount: number;
    contractOrderNumber: string;
    expectedAcceptanceTime?: Date;
    category: string;
    subProjectName: string;
    budgetAmount: number;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'createdAt' | 'updatedAt' | 'remainingBudget' | 'budgetAmount' | 'content' | 'expectedAcceptanceTime'> {
}
declare class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    id: number;
    projectCode: string;
    projectName: string;
    projectType: string;
    projectStatus: string;
    owner: string;
    members: string;
    projectGoal: string;
    projectBackground: string;
    projectExplanation: string;
    procurementCode: string;
    completionStatus: string;
    relatedBudgetProject: string;
    budgetYear: number;
    budgetOccupied: number;
    budgetExecuted: number;
    remainingBudget: number;
    orderAmount: number;
    acceptanceAmount: number;
    contractOrderNumber: string;
    expectedAcceptanceTime?: Date;
    category: string;
    subProjectName: string;
    budgetAmount: number;
    content: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Project;
//# sourceMappingURL=Project.d.ts.map