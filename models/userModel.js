const mongoose = require('mongoose');

// const formSchema = new mongoose.Schema({
// 	form: {
// 		_id: false,
// 		type: Map,
// 		of: String
// 	}
// });
//
// const chapterSchema = new mongoose.Schema({
// 	chapter: {
// 		_id: false,
// 		type: Map,
// 		of: formSchema
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
		default: 'user'
	},
	email: {
		type: String,
		required: true,
		unique: true
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
		type: Map,
		of: Number
	},
	books: [
		{ _id : false,
			titleBook: String,
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

const User = mongoose.model('User', userSchema);
// const Form = mongoose.model('Form', formSchema);
// const Chapter = mongoose.model('Chapter', chapterSchema);

// module.exports = Form;
// module.exports = Chapter;
module.exports = User;

