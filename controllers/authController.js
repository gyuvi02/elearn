const jwt = require("jsonwebtoken");
const User = require('./../models/userModel');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require("../utils/appError");
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pseudoSave = require('./../utils/pseudoSave');
const createSendToken = require('./../utils/createSendToken');
// const signToken = require('./../utils/createSendToken');
// const Book = require("../models/userModel");

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		courses: [], //we just create an empty array and add the courses later
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		books: [{titleBook: req.body.books.titleBook, chapters:[{titleChapter: "", forms:{}}]}],
		courseParticipants: [] //we just create an empty array and add the courses later
	});

	//We can add a new method here that downloads the chapters and the empty forms for the book: req.body.courses.titleBook and upload them to the user's document

	createSendToken(newUser, 201, res);
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
	createSendToken(user, 200, res);

	// token = signToken(user._id);
	//
	// res.status(200).json({
	// 	status: 'success',
	// 	token
	// });
});

exports.logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});
	res.status(200).json({ status: 'success' });
};


exports.protect = catchAsync(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	}else if (req.cookies.jwt){
		token = req.cookies.jwt;
	}

	if (!token) {
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

exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			// 1) verify token
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);

			// 2) Check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}

			// 3) Check if user changed password after the token was issued
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}

			// THERE IS A LOGGED IN USER
			res.locals.datetime = new Date();
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}
	next();
};



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
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	if (user.isModified('password') && user.password === user.passwordConfirm) { //it would be nice to use a pre save hook here, but I cannot use .save at all, so...
		await pseudoSave(user);

		// user.password = await bcrypt.hash(user.password, 12);
		// user.passwordChangedAt = Date.now() - 1000;
		// user.passwordConfirm = undefined;
		// user.passwordResetToken = undefined;
		// user.passwordResetExpires = undefined;
		//
		// await User.findByIdAndUpdate(user.id, user);
		// await User.updateOne({email: user.email}, {passwordResetExpires: user.passwordResetExpires,
		// 	passwordResetToken: user.passwordResetToken,
		// 	passwordConfirm: user.passwordConfirm});
		res.status(200).json({
			status: 'success',
			message: 'Password was modified'
		});

	}else {
		res.status(400).json({
			status: 'fail',
			message: 'Password was not modified'
		});
	}
});

exports.updatePassword = async (req, res, next) => {
	//Get user from collection
	const user = await User.findById(req.user.id).select('+password');

	//Check if POST-ed current password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong', 401));
	}
	//Update the password
	if (req.body.password === req.body.passwordConfirm) {
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		await pseudoSave(user); //as I cannot use .save, I created this method
		createSendToken(user, 200, res);

	} else {
		const token = signToken(req.user.id);
		res.status(400).json({
			status: 'fail',
			message: 'The passwords are different',
			token
		});
	}
};




