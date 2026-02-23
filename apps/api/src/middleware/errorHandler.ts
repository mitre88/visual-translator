import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const appError = err as AppError
  const statusCode = appError.statusCode || 500
  const message = appError.message || 'Internal Server Error'

  logger.error({
    message: appError.message,
    stack: appError.stack,
    statusCode,
    url: req.url,
    method: req.method,
  })

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(statusCode).json({
    error: {
      message,
      ...(isDevelopment && { stack: appError.stack }),
    },
  })
}

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown

export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
