import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';

export const validateFields = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors: Record<string, string> = {};

        errors.array().forEach((error: any) => {
            if (error.location) {
                formattedErrors[error.location] = error.msg;
            } else if (error.param) {
                formattedErrors[error.param] = error.msg;
            }
        });

        return res.status(400).json({
            ok: false,
            errors: formattedErrors,
        });
    }

    next();
};
