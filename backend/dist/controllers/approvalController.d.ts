import { Request, Response } from 'express';
export declare const submitForApproval: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPendingApprovals: (req: Request, res: Response) => Promise<void>;
export declare const reviewApproval: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getApprovalHistory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=approvalController.d.ts.map