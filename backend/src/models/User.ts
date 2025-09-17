import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  accessKey: string;
  username: string;
  displayName: string;
  email?: string;
  role: 'employee' | 'pm';
  department?: string;
  position?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'email' | 'department' | 'position' | 'phone' | 'isActive' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public accessKey!: string;
  public username!: string;
  public displayName!: string;
  public email?: string;
  public role!: 'employee' | 'pm';
  public department?: string;
  public position?: string;
  public phone?: string;
  public isActive!: boolean;
  public lastLoginAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accessKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM('employee', 'pm'),
      allowNull: false,
      defaultValue: 'employee',
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['accessKey']
      },
      {
        unique: true,
        fields: ['username']
      },
      {
        fields: ['role']
      }
    ]
  }
);

export default User;