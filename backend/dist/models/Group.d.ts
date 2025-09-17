import { Model, Optional } from 'sequelize';
export interface GroupAttributes {
    id: number;
    groupName: string;
    description?: string;
    pmId: number;
    isActive: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface GroupCreationAttributes extends Optional<GroupAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {
}
export declare class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
    id: number;
    groupName: string;
    description?: string;
    pmId: number;
    isActive: boolean;
    createdBy: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Group;
//# sourceMappingURL=Group.d.ts.map