import { Model, Optional } from 'sequelize';
export interface ProjectTransferAttributes {
    id: number;
    projectId: number;
    fromUserId: number;
    toUserId: number;
    fromGroupId: number;
    toGroupId: number;
    transferType: 'ownership' | 'budget_reallocation' | 'execution_transfer';
    transferAmount?: number;
    reason: string;
    requesterId: number;
    approverId?: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    approvedAt?: Date;
    completedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProjectTransferCreationAttributes extends Optional<ProjectTransferAttributes, 'id' | 'transferAmount' | 'approverId' | 'approvedAt' | 'completedAt' | 'notes' | 'createdAt' | 'updatedAt'> {
}
export declare class ProjectTransfer extends Model<ProjectTransferAttributes, ProjectTransferCreationAttributes> implements ProjectTransferAttributes {
    id: number;
    projectId: number;
    fromUserId: number;
    toUserId: number;
    fromGroupId: number;
    toGroupId: number;
    transferType: 'ownership' | 'budget_reallocation' | 'execution_transfer';
    transferAmount?: number;
    reason: string;
    requesterId: number;
    approverId?: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    approvedAt?: Date;
    completedAt?: Date;
    notes?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default ProjectTransfer;
//# sourceMappingURL=ProjectTransfer.d.ts.map