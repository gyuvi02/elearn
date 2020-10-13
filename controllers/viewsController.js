const catchAsync = require('../utils/catchAsync');
const User = require("../models/userModel");
const Ebook = require('../models/ebookModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
	res.status(200).render('overview', {
		title: 'ebooksForLearning'
	});
});

exports.getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Login',
		url: '/login'
	});
};

exports.getMyEbooks = catchAsync (async (req, res, next) => {
	let userCourses = [];
	// const ebook = await Ebook.findById(req.user.courses);   //user should exist as we come here from .protect authorization
														//it'll be an array if the user has multiple books
	for (const current of req.user.courses) {
		const newBook = await Ebook.find({_id: current}, {_id: 0, titleBook: 1,
			summaryEbook: 1, coverPhoto: 1 });
		userCourses.push(newBook);
	}

		res.status(200).render('myebooks', {
			title: 'My Ebooks',
			userCourses
		});
});

exports.getOneEbook = catchAsync(async (req, res, next) => {
	const title = req.params.id;
	if (!title) {
		return next(new AppError('There is no ebook with that title', 404))
	}
	// const actualBook = req.user.books.titleBook;
	if (!req.user.books.some(x => x.titleBook === title)) {
		console.log('You do not own that book!');
		return next(new AppError('There is no ebook with that title', 404));
	} else{
		console.log('You have that book!');
		res.status(200).render('ebook', {
			title: 'Ebook'
		});
	}
});

exports.getAccount = (req, res) => {
	// console.log(req.user);
	res.status(200).render('account', {
		title: 'Your account'
	});
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	res.status(200).render('forgotPassword', {
		title: 'New password',
		url: '/forgotPassword'
	});
});



