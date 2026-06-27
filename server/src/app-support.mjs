import * as util from 'util';

export class AppError extends Error {
  constructor( message, statusCode, errorCode = "INTERNAL ERROR" ) {
    super( message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor);
  }
}
// middleware/errorHandler.js
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  
  console.error(`[Error] ${err.stack}`);

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.isOperational ? err.message : 'Something went wrong on our end.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Only show stack trace in dev mode
    }
  });
};

process.on('uncaughtException', function (error, origin) {
    console.error(`I have crached!!! -\n    Error: ${error} \n   Origin: ${origin}`)
})

process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandeled rejection at: ${util.inspect(p)} reason: ${reason}`)
});
