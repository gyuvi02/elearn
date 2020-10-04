const catchAsync = require('../utils/catchAsync');
const User = require("../models/userModel");
const Ebook = require('../models/ebookModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
	// const users = await User.find();
	const dt = new Date();
	res.status(200).render('overview', {
		title: 'ebookstolearn.org',
		datetime: dt,
		// users
	});
});

exports.getLoginForm = (req, res) => {
	const dt = new Date();

	res.status(200).render('login', {
		title: 'Login',
		datetime: dt
	});
};

exports.getMyEbooks = catchAsync (async (req, res, next) => {
	let ebookArray = [];
	const ebook = await Ebook.findById(req.user.courses);   //user should exist as we come here from .protect authorization
														//it'll be an array if the user has multiple books
	for (const current of req.user.courses) {
		const newBook = await Ebook.find({_id: current});
		ebookArray.push(newBook[0].titleBook);
	}
	if (ebook.isEmpty) {
		return next(new AppError('There are no ebooks for this user', 404));
	} else {
		console.log(ebookArray);
		res.status(200).render('myebooks', {
			title: 'My Ebooks',
			data: {
				ebookArray
			}
		});
	}
});

exports.getOneEbook = catchAsync(async (req, res, next) => {
	const title = req.params.id;
	// const actualBook = req.user.books.titleBook;
	if (!req.user.books.some(x => x.titleBook === title)) {
		console.log('You do not own that book!')
		return next(new AppError('There is no ebook with that title', 404));
	} else{
		console.log('You have that book!')
		res.status(200).render('ebook', {
			title
		});
	}
});




