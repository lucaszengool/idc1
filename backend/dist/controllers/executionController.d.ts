import { Request, Response } from 'express';
export declare const createExecution: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getExecutions: (req: Request, res: Response) => Promise<void>;
export declare const getExecutionsByProject: (req: Request, res: Response) => Promise<void>;
export declare const updateExecution: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteExecution: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=executionController.d.ts.map