import { Model, Optional } from 'sequelize';
interface BudgetExecutionAttributes {
    id: number;
    projectId: number;
    executionAmount: number;
    executionStatus: string;
    voucherUrl?: string;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface BudgetExecutionCreationAttributes extends Optional<BudgetExecutionAttributes, 'id'> {
}
declare class BudgetExecution extends Model<BudgetExecutionAttributes, BudgetExecutionCreationAttributes> implements BudgetExecutionAttributes {
    id: number;
    projectId: number;
    executionAmount: number;
    executionStatus: string;
    voucherUrl?: string;
    createdBy: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default BudgetExecution;
//# sourceMappingURL=BudgetExecution.d.ts.map