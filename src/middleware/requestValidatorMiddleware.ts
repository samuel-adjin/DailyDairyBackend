import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject } from "zod";



const RequestValidator = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = await schema.safeParseAsync(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.errors.map((err: any) => ({
          path: err.path,
          message: err.message,
        })),
      });
    }

    req.body = validation.data;
    next();
  } catch (error) {
    next(error)
  }
}

export default RequestValidator