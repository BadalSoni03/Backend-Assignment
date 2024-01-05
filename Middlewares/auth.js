const User = require('../Models/User');
const jwt = require('jsonwebtoken');


const isAuth = async (req , res , next) => {
	try {
		const token = req.headers?.authorization?.replace('JWT ' , '') || req.cookies?.authToken;

		if (!token) {
			return res.status(403).send({
				success : false,
				message : 'Unauthorized access'
			});
		}

		const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
		const user = await User.findOne({_id : decoded._id});
		if (!user) {
			return res.status(403).send({
				success : false,
				message : 'Unauthorized access'
			});
		}
		req.user = user;
		next();
		
	} catch (error) {
		let statusCode = 501;
		let errorMessage = 'Internal server error';

		if (error === 'JsonWebTokenError') {
			statusCode = 403;
			errorMessage = 'Unauthorized access';
		} 
		else if (error === 'TokenExpiredError') {
			statusCode = 401;
			errorMessage = 'Session expired';
		}
		return res.status(statusCode).send({
			success : false,
			message : errorMessage,
			error : error.message
		});
	}
}

module.exports = isAuth;