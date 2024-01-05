const express = require('express');
const router = express.Router();
const isAuth = require('../Middlewares/auth');
const {
	createNoteController,
	shareNoteController,
	getAllNotesController,
	getParticularNoteController,
	searchNoteController,
	updateNoteController,
	deleteNoteController
} = require('../Controllers/noteController');


//-------------------------------POST APIs-----------------------------/


router.post('/' , isAuth , createNoteController);


router.post('/:id/share' , isAuth , shareNoteController);


//--------------------------------GET APIs-----------------------------/


router.get('/' , isAuth , getAllNotesController);


router.get('/:id' , isAuth , getParticularNoteController);



//--------------------------------PUT APIs-----------------------------/


router.put('/:id' , isAuth , updateNoteController);


//--------------------------------DELETE APIs-----------------------------/


router.delete('/:id' , isAuth , deleteNoteController);


module.exports = router;