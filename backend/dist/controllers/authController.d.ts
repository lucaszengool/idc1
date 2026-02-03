import { Request, Response } from 'express';
export declare const loginWithAccessKey: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const changePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const toggleUserActive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resetUserPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchUsers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map