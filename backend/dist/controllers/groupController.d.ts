import { Request, Response } from 'express';
export declare const createGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getGroups: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addGroupMember: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removeGroupMember: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchUsersForGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateGroup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=groupController.d.ts.map