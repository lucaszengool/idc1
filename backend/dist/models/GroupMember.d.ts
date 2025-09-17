import { Model, Optional } from 'sequelize';
export interface GroupMemberAttributes {
    id: number;
    groupId: number;
    userId: number;
    joinedAt: Date;
    addedBy: number;
}
export interface GroupMemberCreationAttributes extends Optional<GroupMemberAttributes, 'id' | 'joinedAt'> {
}
export declare class GroupMember extends Model<GroupMemberAttributes, GroupMemberCreationAttributes> implements GroupMemberAttributes {
    id: number;
    groupId: number;
    userId: number;
    joinedAt: Date;
    addedBy: number;
}
export default GroupMember;
//# sourceMappingURL=GroupMember.d.ts.map