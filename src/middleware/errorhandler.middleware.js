export const ErrorHandler = (error, req, res, next) => {
  if (error) {
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);

    const statusCode = error.status || 500;

    res.status(statusCode).json({
      message: error.message || 'An unexpected error occurred',
    });
  } else {
    next();
  }
};
