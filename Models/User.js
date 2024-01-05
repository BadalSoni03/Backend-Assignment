const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	fullName : {
		type : String,
		required : true,
		trim : true
	},
	username : {
		type : String,
		required : true,
		trim : true
	},
	email : {
		type : String,
		required : true,
		unique : true	
	},
	password : {
		type : String,
		required : true,
	},
	sharedWithMe : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Note'
	}]
}, {
	timestamp : true
});


userSchema.pre('save' , async function (next) {
	if (this.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password , salt);
		this.password = hashedPassword;
	}
	next();
});

const User = mongoose.model('User' , userSchema);
module.exports = User;