const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
	author : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	},
	title : {
		type : String,
		required : true
	},
	content : {
		type : String,
		required : true,
	}
}, {
	timestamp : true
});

const Note = mongoose.model('Notes' , notesSchema);

module.exports = Note;