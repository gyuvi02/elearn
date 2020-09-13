const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'A first name is required']
	},
	lastName: {
		type: String,
		required: [true, 'A last name is required']
	},
	role: {
		type: String,
		default: 'user'
	},
	email: {
		type: String,
		required: true,
		unique: true
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
