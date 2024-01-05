const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('../asyncHandler');


//-------------------------------POST Controllers-----------------------------/


const signUpController = asyncHandler(async (req , res) => {
	const { fullName , username , email , password } = req.body;

	const user = await User.findOne({email});
	if (user) {
		return res.status(401).send({
			success : false,
			message : 'You have already registered in the application'
		});
	}

	const newUser = await User({
		fullName,
		username,
		email,
		password
	});

	try {
		await newUser.save();
	} catch (error) {
		return res.status(500).send({
			success : false,
			message : 'Error while registering the user',
			error : error.message
		});
	}


	return res.status(201).send({
		success : true,
		message : 'User created successfully',
		newUser
	});
});


const loginController = asyncHandler(async (req , res) => {
	const { email , username , password } = req.body;
	const user = await User.findOne({email});

	if (!user) {
		return res.status(401).send({
			success : false,
			message : 'You havent registered in the application'
		});
	}

	const areMatching = await bcrypt.compare(password , user.password);
	if (!areMatching) {
		return res.status(401).send({
			success : false,
			message : 'username / email / passwords are not matching'
		});
	}

	const options = {
		httpOnly : true,
		secure : process.env.NODE_ENV === 'production'
	};

	try {
		const token = jwt.sign({_id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : '1d'});
		
		// also returning the token as a response along with the cookie because the requesting
		// device can be a mobile phone (other than a browser)

		return res.cookie('authToken' , token , options).status(200).send({
			success : true,
			name : user.username,
			token : 'JWT ' + token
		});
	} catch (error) {
		return res.status(501).send({
			success : false,
			message : 'Error while generating the token'
		});
	}

	return res.status(501).send({
		success : false,
		message : 'Error while logging in the user'
	});
});


const logoutController = asyncHandler(async (req , res) => {
	res.cookie('authToken' , '').status(200).send({
		success : true,
		message : 'Logged out successfully'
	});
});

module.exports = {
	signUpController,
	loginController,
	logoutController
};

