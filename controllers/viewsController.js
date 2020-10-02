const catchAsync = require('../utils/catchAsync');
const User = require("../models/userModel");

exports.getOverview = catchAsync(async (req, res, next) => {
	const users = await User.find();
	const dt = new Date();
	// const d2 = `${dt.getMonth()+1}. ${dt.getDate()}. ${dt.getFullYear()}. `;
	// const d2 = dt.toLocaleDateString();
	res.status(200).render('overview', {
		title: 'ebookstolearn.org',
		datetime: dt,
		users
	});
});

exports.getLogin = (req, res, next) => {
	const dt = new Date();

	res.status(200).render('login', {
		title: 'Login',
		datetime: dt
	});
};

exports.getEbook = (req, res, next) => {
	const dt = new Date();

	res.status(200).render('login', {
		title: 'Ebook',
		datetime: dt
	});
};


