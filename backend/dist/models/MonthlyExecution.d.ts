import { Model, Optional } from 'sequelize';
interface MonthlyExecutionAttributes {
    id: number;
    projectId: number;
    year: number;
    month: number;
    planDescription: string;
    actualDescription: string;
    isCompleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface MonthlyExecutionCreationAttributes extends Optional<MonthlyExecutionAttributes, 'id'> {
}
declare class MonthlyExecution extends Model<MonthlyExecutionAttributes, MonthlyExecutionCreationAttributes> implements MonthlyExecutionAttributes {
    id: number;
    projectId: number;
    year: number;
    month: number;
    planDescription: string;
    actualDescription: string;
    isCompleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default MonthlyExecution;
//# sourceMappingURL=MonthlyExecution.d.ts.map