const catchAsync = require('../utils/catchAsync');

exports.getOverview = (req, res, next) => {
	const dt = new Date();
	const d2 = `${dt.getFullYear()}. ${dt.getMonth()+1}. ${dt.getDate()}.`;
	// const d2 = dt.toLocaleDateString();
	res.status(200).render('overview', {
		title: 'ebookstolearn.org',
		datetime: d2
	});
};

exports.getLogin = (req, res, next) => {
	res.status(200).render('login', {
		title: 'Login'
	});
};


