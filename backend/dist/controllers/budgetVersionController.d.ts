import { Request, Response } from 'express';
export declare const createBudgetVersion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllBudgetVersions: (req: Request, res: Response) => Promise<void>;
export declare const getActiveBudgetVersion: (req: Request, res: Response) => Promise<void>;
export declare const setActiveBudgetVersion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBudgetVersion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=budgetVersionController.d.ts.map