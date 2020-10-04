const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack
		});
	} else {
		res.status(err.statusCode).render('error', {
			title: 'Something went wrong',
			msg: err.message
		})
	}
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		console.error('ERROR', err)

		res.status(500).json({
			status: 'error',
			message: 'Something went wrong!'
		});
	}
};

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppError(message, '400');
};

const handleDuplicateFieldDB = err => {
	const message = `Duplicate field value: ${err.keyValue.email}. Please use another value.`;
	return new AppError(message, '400')
};

const handleJWTError = () => new AppError('Invalid token, please log in again!', 401);

const handleJWTExpired = () => new AppError('Your token has expired, please log in again', 401);

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpired();

		else error = new AppError(err.message, 400);

		sendErrorProd(error, req, res);
	}
};




