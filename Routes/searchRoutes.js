const express = require('express');
const router = express.Router();
const isAuth = require('../Middlewares/auth');
const {
	searchNoteController
} = require('../Controllers/noteController');


//--------------------------------GET APIs-----------------------------/


router.get('/' , isAuth , searchNoteController);


module.exports = router;