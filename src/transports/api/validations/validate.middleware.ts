import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          type: 'validation_error' as const,
        }));
        return res.status(400).json({ status: 'failed', message: 'Validation error', data: null, errors, metadata: null });
      }
      next(error);
    }
  };
};
