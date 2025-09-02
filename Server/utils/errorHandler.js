/**
 * Global error handling utilities
 */

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Production error response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Programming or unknown error
  console.error('ERROR 💥', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
};

export const handleSequelizeErrors = (error) => {
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => err.message);
    return new AppError(`Validation Error: ${errors.join('. ')}`, 400);
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0].path;
    return new AppError(`${field} already exists`, 409);
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return new AppError('Invalid reference to related data', 400);
  }

  return new AppError('Database operation failed', 500);
};
