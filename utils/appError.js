class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.startsWith('4') ? 'notFound' : 'error';
    this.IsOperational = true;
  }
}

module.exports = AppError;
