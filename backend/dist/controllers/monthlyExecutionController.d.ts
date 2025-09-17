import { Request, Response } from 'express';
export declare const createMonthlyExecution: (req: Request, res: Response) => Promise<void>;
export declare const getMonthlyExecutions: (req: Request, res: Response) => Promise<void>;
export declare const updateMonthlyExecution: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMonthlyExecution: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createBatchMonthlyExecutions: (req: Request, res: Response) => Promise<void>;
export declare const getProjectYearlyPlan: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=monthlyExecutionController.d.ts.map