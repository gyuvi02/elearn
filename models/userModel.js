const mongoose = require('mongoose');
const validator = require('validator');

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
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Incorrect email format']
	},
	photo: String,
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minLength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password']
	},
	course: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	loginTime: {
		type: Date
		// type: Map,
		// of: Number
	},
	books: [
		{ _id : false,
			titleBook: String,
			coverBook: String,
			chapters: [
				{
					_id : false,
					titleChapter: String,
					forms: {
						type: Map,
						of: String
					}
				}
			]
		}
	]
});

userSchema.pre(/^find/, function(next) {
	this.loginTime = Date.now();
	next();
})


const User = mongoose.model('User', userSchema);
module.exports = User;

