const Note = require('../Models/Note');
const User = require('../Models/User');
const asyncHandler = require('../asyncHandler');
const NodeCache = require('node-cache');
const nodeCache = new NodeCache();


//-------------------------------POST Controllers-----------------------------/


const createNoteController = asyncHandler(async (req , res) => {
	const author = req.user;
	const { title , content } = req.body;

	const newNote = await Note({
		author : req.user._id,
		title,
		content
	});

	try {
		await newNote.save();
	} catch (error) {
		return res.status(500).send({
			success : false,
			message : 'Error while creating the Note',
			error : error.message
		});
	}

	return res.status(201).send({
		success : true,
		message : 'Note created successfully',
		note : newNote,
		author : req.user.username
	});
});


const shareNoteController = asyncHandler(async (req , res) => {
	const me = req.user;
	const { receiverUsername } = req.body;
	const { id } = req.params;

	const note = await Note.findById({_id : id});
	const receiver = await User.findOneAndUpdate({ username : receiverUsername } , {
		'$push' : {
			'sharedWithMe' : note
		}
	} , { new : true });

	return res.status(200).send({
		success : true,
		message : 'Note shared successfully to ' + receiver.username,
		receiver
	});
});


//--------------------------------GET Controllers-----------------------------/


const getAllNotesController = asyncHandler(async (req , res) => {
	let allNotes = undefined;
	if (nodeCache.has('Notes')) {
		allNotes = JSON.parse(nodeCache.get('Notes'));
	}
	else {
		allNotes = await Note.find({} , {
			_id : 0,
			__v : 0
		}).populate('author' , 'fullName username -_id');
		nodeCache.set('Notes' , JSON.stringify(allNotes) , 20);
	}
	
	return res.status(200).send({
		success : true,
		notes : allNotes
	});
});


const getParticularNoteController = asyncHandler(async (req , res) => {
	const { id } = req.params;
	const note = await Note.find({_id : id}).populate('author' , 'fullName username -_id');

	res.status(200).send({
		success : true,
		note
	});
});


const searchNoteController = asyncHandler(async (req , res) => {
	const {keyword} = req.query;
	const notes = await Note.find({
		$or : [
			{title : {$regex : keyword}},
			{content : {$regex : keyword}}
		]
	});

	return res.status(200).send({
		success : true,
		notes
	});
});


//--------------------------------PUT Controllers-----------------------------/


const updateNoteController = asyncHandler(async (req , res) => {
	const {id} = req.params;
	const {title , content} = req.body;

	if (!title && !content) {
		return res.status(200).send({
			success : true,
			message : 'Nothing changed'
		});
	} else {
		const note = await Note.findById(id).populate('author' , 'fullName username -_id');
		if (title) {
			note.title = title;
		}
		if (content) {
			note.content = content;
		}
		return res.status(200).send({
			success : true,
			message : 'Note updated successfully',
			note
		});
	}
});


//--------------------------------DELETE Controllers-----------------------------/


const deleteNoteController = asyncHandler(async (req , res) => {
	const {id} = req.params;
	const {title , content} = req.body;

	await Note.deleteOne({_id : id});
	return res.status(200).send({
		success : true,
		message : 'Note deleted successfully'
	});
});

module.exports = {
	createNoteController,
	shareNoteController,
	getAllNotesController,
	getParticularNoteController,
	searchNoteController,
	updateNoteController,
	deleteNoteController
}