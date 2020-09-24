const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
		required: [true, 'Please confirm your password'],
		validate: {
			// This only works on CREATE and SAVE!!!
			validator: function(el) {
				return el === this.password;
			},
			message: 'Passwords are not the same!'
		}

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
			titleBook: {
				type: String,
				default: 'Radiology'},
			coverBook: String,
			chapters: [
				{
					_id : false,
					titleChapter: {
						type: String,
						default: '101'},
					forms: {
						type: Map,
						of: String,
						default: {"10101": "Proba"},
					}
				}
			]
		}
	]
});

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
})

userSchema.pre(/^find/, function (next) {
	this.loginTime = Date.now();
	next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

