const mongoose = require('mongoose');
const Schema = require("mongoose");


const ebookSchema = new mongoose.Schema({
	titleBook: {
		type: String,
		unique: true
	},
	chapters:{
		type: String,
		required: true,
		default: '/public'
	},  //here we store the address inside /public library, where we find the book chapters
	coverPhoto: {
		type: String,
		required: true,
		default: '/public/images/bookCovers'
	}
})

const Ebook = mongoose.model('Ebook', ebookSchema);

module.exports = Ebook;
