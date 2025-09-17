import { Request, Response } from 'express';
export declare const loginWithAccessKey: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchUsers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map