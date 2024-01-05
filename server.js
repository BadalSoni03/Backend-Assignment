require('dotenv').config();
const express = require('express');
const cokkieParser = require('cookie-parser');
const connectDB = require('./db.js');
const app = express();

connectDB();

const {rateLimit} = require('express-rate-limit');
const rateLimiting = rateLimit({
	windowMs : 60 * 1000, // 1 minute
	max : 10,
	message : 'You have crossed the 10 request limit in one minute',
	standardHeaders : true,
	legacyHeaders : false
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cokkieParser());
// app.use(rateLimiting);


// home route
app.get('/' , (req , res) => {
	res.status(200).send(
		'Welcome to the Lets Share Notes Application'
	);
});


// Routes
const authRoute = require('./Routes/authRoutes');
const noteRoute = require('./Routes/noteRoutes');
const searchRoute = require('./Routes/searchRoutes');

app.use('/api/auth' , authRoute);
app.use('/api/notes' , noteRoute);
app.use('/api/search' , searchRoute);


const port = process.env.PORT || 5000;
app.listen(port , () => {
	const baseUrl = 'http://' + process.env.HOST + ':' + port;
	console.log('Node server running on : ' + baseUrl);
});