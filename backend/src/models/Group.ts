import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

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

export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class Group extends Model<GroupAttributes, GroupCreationAttributes>
  implements GroupAttributes {
  public id!: number;
  public groupName!: string;
  public description?: string;
  public pmId!: number;
  public isActive!: boolean;
  public createdBy!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pmId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'groups',
    timestamps: true,
  }
);

export default Group;