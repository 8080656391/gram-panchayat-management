import { Response } from 'express';

export const parseMongooseError = (error: any): string | null => {
  if (!error) return null;

  if (error.name === 'ValidationError') {
    return Object.values(error.errors)
      .map((val: any) => val.message)
      .join(', ');
  }

  if (error.code === 11000) {
    return 'Duplicate field value entered';
  }

  return null;
};

export const sendErrorResponse = (res: Response, error: any, defaultMessage = 'Server error') => {
  const message = parseMongooseError(error) || defaultMessage;
  const status = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500;

  res.status(status).json({
    success: false,
    message
  });
};
