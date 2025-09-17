import { Model, Optional } from 'sequelize';
export interface TotalBudgetAttributes {
    id: number;
    budgetYear: string;
    totalAmount: number;
    description?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface TotalBudgetCreationAttributes extends Optional<TotalBudgetAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {
}
export declare class TotalBudget extends Model<TotalBudgetAttributes, TotalBudgetCreationAttributes> implements TotalBudgetAttributes {
    id: number;
    budgetYear: string;
    totalAmount: number;
    description?: string;
    createdBy: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default TotalBudget;
//# sourceMappingURL=TotalBudget.d.ts.map