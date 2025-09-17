import { Model, Optional } from 'sequelize';
export interface ApprovalAttributes {
    id: number;
    requestType: 'project_create' | 'project_update' | 'project_transfer' | 'execution_create' | 'execution_update' | 'budget_adjustment';
    requestData: any;
    requesterId: number;
    approverId: number;
    groupId: number;
    status: 'pending' | 'approved' | 'rejected';
    reviewNotes?: string;
    submittedAt: Date;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ApprovalCreationAttributes extends Optional<ApprovalAttributes, 'id' | 'reviewNotes' | 'reviewedAt' | 'createdAt' | 'updatedAt'> {
}
export declare class Approval extends Model<ApprovalAttributes, ApprovalCreationAttributes> implements ApprovalAttributes {
    id: number;
    requestType: 'project_create' | 'project_update' | 'project_transfer' | 'execution_create' | 'execution_update' | 'budget_adjustment';
    requestData: any;
    requesterId: number;
    approverId: number;
    groupId: number;
    status: 'pending' | 'approved' | 'rejected';
    reviewNotes?: string;
    submittedAt: Date;
    reviewedAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Approval;
//# sourceMappingURL=Approval.d.ts.map