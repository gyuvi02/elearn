const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Schema = require("mongoose");

// const chapterSchema = new mongoose.Schema({
// 	chapterTitel: String,
// 	chapter: [
// 		{
// 			forms: {
// 				type: Map,
// 				of: String,
// 				default: {"10101": "Proba"}
// 			}
// 		}
// 	]
// });
//
// const bookSchema = new mongoose.Schema({
// 	titleBook: String,
// 	bookCover: String,
// 	chapter: {
// 		type: Schema.Types.ObjectId,
// 		ref: 'Chapter'
// 	}
// });

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
		enum: ['user', 'admin', 'teacher'],
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
		// validate: {
		// 	// This only works on CREATE and SAVE!!!
		// 	validator: function(el) {
		// 		return el === this.password;
		// 	},
		// 	message: 'Passwords are not the same!'
		// }
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
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
	// books: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Book'
	// }


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

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp; //false means we are OK, password was not changed
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + (10 * 60 * 1000);

	return resetToken;
};


const User = mongoose.model('User', userSchema);
// const Book = mongoose.model('Book', bookSchema);
// const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = User;
// module.exports = Book;
// module.exports = Chapter;

