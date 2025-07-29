const AppError = require('./appError');
const HttpStatusCode = require('./httpStatusCode');

const sendErrorDev = (err, req, res) => {
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stackTrace: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
    if(err.isOperational) {

    // Operational, trusted error: send message to client
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
  });
    } else {
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

const globalErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);


    } else if (process.env.NODE_ENV === 'production') {
        if(err.name === 'castError') err = handleCastError(err);
        // Log the error to a file or monitoring service here if needed
        sendErrorProd(err, req, res);   

    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
    });
}
};

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, HttpStatusCode.BAD_REQUEST);
};

module.exports = globalErrorHandler;
