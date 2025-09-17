import { Request, Response } from 'express';
export declare const initiateProjectTransfer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProjectTransfers: (req: Request, res: Response) => Promise<void>;
export declare const approveProjectTransfer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectProjectTransfer: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBudgetReallocationOptions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=projectTransferController.d.ts.map