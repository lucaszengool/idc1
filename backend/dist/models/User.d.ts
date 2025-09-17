import { Model, Optional } from 'sequelize';
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
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'email' | 'department' | 'position' | 'phone' | 'isActive' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map