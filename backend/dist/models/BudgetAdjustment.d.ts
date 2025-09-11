import { Model, Optional } from 'sequelize';
interface BudgetAdjustmentAttributes {
    id: number;
    originalProjectId: number;
    newProjectName: string;
    adjustmentReason: string;
    adjustmentAmount: number;
    targetCategory: string;
    targetProject: string;
    targetSubProject: string;
    targetOwner: string;
    createdAt?: Date;
    updatedAt?: Date;
}
interface BudgetAdjustmentCreationAttributes extends Optional<BudgetAdjustmentAttributes, 'id'> {
}
declare class BudgetAdjustment extends Model<BudgetAdjustmentAttributes, BudgetAdjustmentCreationAttributes> implements BudgetAdjustmentAttributes {
    id: number;
    originalProjectId: number;
    newProjectName: string;
    adjustmentReason: string;
    adjustmentAmount: number;
    targetCategory: string;
    targetProject: string;
    targetSubProject: string;
    targetOwner: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default BudgetAdjustment;
//# sourceMappingURL=BudgetAdjustment.d.ts.map