import { Model, Optional } from 'sequelize';
export interface BudgetVersionAttributes {
    id: number;
    versionName: string;
    budgetYear: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    uploadedBy: string;
    description?: string;
    isActive: boolean;
    totalBudget?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface BudgetVersionCreationAttributes extends Optional<BudgetVersionAttributes, 'id' | 'description' | 'totalBudget' | 'createdAt' | 'updatedAt'> {
}
declare class BudgetVersion extends Model<BudgetVersionAttributes, BudgetVersionCreationAttributes> implements BudgetVersionAttributes {
    id: number;
    versionName: string;
    budgetYear: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    uploadedBy: string;
    description?: string;
    isActive: boolean;
    totalBudget?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default BudgetVersion;
//# sourceMappingURL=BudgetVersion.d.ts.map