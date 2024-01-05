const express = require('express');
const router = express.Router();
const isAuth = require('../Middlewares/auth');
const {
	signUpController,
	loginController,
	logoutController
} = require('../Controllers/authController');


//-------------------------------POST APIs-----------------------------/


router.post('/signup' , signUpController);


router.post('/login' , loginController);


router.post('/logout' , isAuth , logoutController);


module.exports = router;