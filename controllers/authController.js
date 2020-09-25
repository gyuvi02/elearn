const jwt = require("jsonwebtoken");
const User = require('./../models/userModel');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("../utils/appError");
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signUp = catchAsync(async (req, res, next) => {
	// const newUser = await User.create(req.body);
	console.log(req.body.books);
	const newUser = await User.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		course: req.body.course,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		books: [{titleBook: req.body.books.titleBook, chapters:[{titleChapter: "", forms:{}}]}]
	});

	//We can add a new method here that downloads the chapters and the empty forms for the book: req.body.books.titleBook and upload them to the user's document

	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN });

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser
		}
	})
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401))
	}
	token = signToken(user._id);

	res.status(200).json({
		status: 'success',
		token
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	}
	if (!token) {
		console.log(token);
		return next(new AppError('Your are not logged in. Please log in to get access.', 401));
	}
	//Token verification
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	//Checking if the user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to the token doesn\'t exist any more.', 401));
	}

	//Checking if the password was changed in the meantime
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('User recently changed password! Please log in again!', 401));
	}
	req.user = currentUser;
	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}
		next();
	}
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError('There is no user with that email address', 404));
	}
	//Generate a random reset token
	const resetToken = user.createPasswordResetToken();
	await User.updateOne({email: req.body.email}, {passwordResetExpires: user.passwordResetExpires, passwordResetToken: user.passwordResetToken});
	// await user.save({validateBeforeSave: false});
	console.log(resetToken);
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with your new password. To confirm your new password, go to: ${resetURL}\n
  If you did not ask for a new password, please ignore this email`;

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 minutes)',
			message
		});
		res.status(200).json({
			status: 'success',
			message: 'Token sent to email'
		});
	} catch (err){
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		// await user.save({validateBeforeSave: false});
		await User.updateOne({email: req.body.email}, {passwordResetExpires: user.passwordResetExpires, passwordResetToken: user.passwordResetToken});
		return next(new AppError('There was an error sending the email, try again later', 500));
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const hashedToken = crypto.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	const user = await User.findOne(
		{
			passwordResetToken: hashedToken,
			passwordResetExpires: {$gt: Date.now()}
		})
	//If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or expired!', 400));
	}
	// user.password = req.body.password;
	// user.passwordConfirm = req.body.passwordConfirm;
	console.log(user.password);
	if (req.body.password === req.body.passwordConfirm) {
		user.password = await bcrypt.hash(req.body.password, 12);
		user.passwordConfirm = undefined;
	}
	console.log(user.password);
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await User.findByIdAndUpdate(user.id, user);
	await User.updateOne({email: user.email}, {passwordResetExpires: user.passwordResetExpires,
			passwordResetToken: user.passwordResetToken,
			passwordConfirm: user.passwordConfirm});

	res.status(200).json({
		status: 'success',
		message: 'Password modified'
	});

});





