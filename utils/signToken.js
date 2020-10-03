const jwt = require("jsonwebtoken");

signToken = id => {
	console.log(id);
	return jwt.sign({ id }, process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN });
};

module.exports = signToken;

