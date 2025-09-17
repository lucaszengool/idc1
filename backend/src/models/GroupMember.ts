import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface GroupMemberAttributes {
  id: number;
  groupId: number;
  userId: number;
  joinedAt: Date;
  addedBy: number;
}

export interface GroupMemberCreationAttributes
  extends Optional<GroupMemberAttributes, 'id' | 'joinedAt'> {}

export class GroupMember extends Model<GroupMemberAttributes, GroupMemberCreationAttributes>
  implements GroupMemberAttributes {
  public id!: number;
  public groupId!: number;
  public userId!: number;
  public joinedAt!: Date;
  public addedBy!: number;
}

GroupMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    addedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'group_members',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['groupId', 'userId']
      }
    ]
  }
);

export default GroupMember;