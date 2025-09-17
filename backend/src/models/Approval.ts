import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ApprovalAttributes {
  id: number;
  requestType: 'project_create' | 'project_update' | 'project_transfer' | 'execution_create' | 'execution_update' | 'budget_adjustment';
  requestData: any; // JSON object containing the request details
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

export interface ApprovalCreationAttributes
  extends Optional<ApprovalAttributes, 'id' | 'reviewNotes' | 'reviewedAt' | 'createdAt' | 'updatedAt'> {}

export class Approval extends Model<ApprovalAttributes, ApprovalCreationAttributes>
  implements ApprovalAttributes {
  public id!: number;
  public requestType!: 'project_create' | 'project_update' | 'project_transfer' | 'execution_create' | 'execution_update' | 'budget_adjustment';
  public requestData!: any;
  public requesterId!: number;
  public approverId!: number;
  public groupId!: number;
  public status!: 'pending' | 'approved' | 'rejected';
  public reviewNotes?: string;
  public submittedAt!: Date;
  public reviewedAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Approval.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requestType: {
      type: DataTypes.ENUM('project_create', 'project_update', 'project_transfer', 'execution_create', 'execution_update', 'budget_adjustment'),
      allowNull: false,
    },
    requestData: {
      type: DataTypes.JSON,
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
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    reviewNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reviewedAt: {
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
    tableName: 'approvals',
    timestamps: true,
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['approverId']
      },
      {
        fields: ['requesterId']
      },
      {
        fields: ['groupId']
      }
    ]
  }
);

export default Approval;