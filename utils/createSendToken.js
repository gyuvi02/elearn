const jwt = require("jsonwebtoken");
const signToken = require('./signToken');

createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true
	};
	if (process.env.NODE_ENV ===  'production') cookieOptions.secure = true;
	res.cookie('jwt', token, cookieOptions);
	user.password = undefined; //removes the password from the output

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	});
};

// signToken = id => {
// 	return jwt.sign({ id }, process.env.JWT_SECRET,
// 		{ expiresIn: process.env.JWT_EXPIRES_IN });
// };

module.exports = createSendToken;

