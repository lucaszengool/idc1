import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

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

export interface ProjectTransferCreationAttributes
  extends Optional<ProjectTransferAttributes, 'id' | 'transferAmount' | 'approverId' | 'approvedAt' | 'completedAt' | 'notes' | 'createdAt' | 'updatedAt'> {}

export class ProjectTransfer extends Model<ProjectTransferAttributes, ProjectTransferCreationAttributes>
  implements ProjectTransferAttributes {
  public id!: number;
  public projectId!: number;
  public fromUserId!: number;
  public toUserId!: number;
  public fromGroupId!: number;
  public toGroupId!: number;
  public transferType!: 'ownership' | 'budget_reallocation' | 'execution_transfer';
  public transferAmount?: number;
  public reason!: string;
  public requesterId!: number;
  public approverId?: number;
  public status!: 'pending' | 'approved' | 'rejected' | 'completed';
  public approvedAt?: Date;
  public completedAt?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjectTransfer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    fromGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    toGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    transferType: {
      type: DataTypes.ENUM('ownership', 'budget_reallocation', 'execution_transfer'),
      allowNull: false,
    },
    transferAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    approverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'project_transfers',
    timestamps: true,
  }
);

export default ProjectTransfer;