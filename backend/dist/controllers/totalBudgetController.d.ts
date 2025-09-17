import { Request, Response } from 'express';
export declare const createOrUpdateTotalBudget: (req: Request, res: Response) => Promise<void>;
export declare const getTotalBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllTotalBudgets: (req: Request, res: Response) => Promise<void>;
export declare const deleteTotalBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=totalBudgetController.d.ts.map