const AppError = require('../utils/AppError');

const handleSequelizeValidationError = (err) => {
  const message = err.errors[0].message;
  return new AppError(message, 400);
};

const SequelizeUniqueConstraintError = (err) => {
  const message = err.errors[0].message;
  return new AppError(message, 400);
};

const SequelizeDatabaseError = (err) => {
  const message = err.message;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational errors( user errors) expose error details to user for correction
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //send generic error message in case its an internal server error
    console.error('ERROR: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV == 'test'
  ) {
    let error = { ...err };
    error.message = err.message;
    if (error.name == 'SequelizeValidationError') {
      error = handleSequelizeValidationError(error);
    }
    if (error.name == 'SequelizeUniqueConstraintError') {
      error = SequelizeUniqueConstraintError(error);
    }
    if (error.name == 'SequelizeDatabaseError') {
      error = SequelizeDatabaseError(error);
    }
    sendErrorProd(error, res);
  }
};
