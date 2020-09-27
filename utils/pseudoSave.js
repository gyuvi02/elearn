const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');

const pseudoSave = async (user) => {
	user.password = await bcrypt.hash(user.password, 12);
	console.log(user.password);
	user.passwordChangedAt = Date.now() - 1000;
	user.passwordConfirm = undefined;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await User.findByIdAndUpdate(user.id, user);
	await User.updateOne({email: user.email}, {passwordResetExpires: user.passwordResetExpires,
		passwordResetToken: user.passwordResetToken,
		passwordConfirm: user.passwordConfirm});
}

module.exports = pseudoSave;
