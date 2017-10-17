import Mongo from 'mongodb';
import connect from '../connect';
import permission from '../permission';


const STORY_TYPES = [
	'challengeUnlock',
	'challengeRespond',
	'challengeCheck',
	'useHint',
	'custom',
	'user'
];


/**
 * Get all published stories
 * @param {*} user
 * @param {String} storyType 
 * @param {Number?} skip 
 * @param {Number?} limit 
 */
const getStories = async function(user, storyType, skip = 0, limit = 0) {
	return _getStories(false, user, storyType, skip, limit);
}


/**
 * Get all stories (admin only)
 * @param {*} user 
 * @param {String} storyType 
 * @param {Number?} user 
 * @param {Number?} user 
 */
const getAllStories = async function(user, storyType, skip = 0, limit = 0) {
	return _getStories(true, user, storyType, skip, limit);
}


/**
 * Helper method for getting stories from the database
 * @param {Boolean} all 
 * @param {*} user 
 * @param {String} storyType 
 * @param {Number?} user 
 * @param {Number?} user 
 */
const _getStories = async function(all, user, storyType, skip, limit) {
	if (!user) return new Error('No user logged in');
	
	let authorized, findParams, sortParams;

	if (all) {
		authorized = await permission.checkPermission(user, ['admin:modify-feed']);
		findParams = { };
		sortParams = { createDate: -1 };
	}
	else {
		authorized = await permission.checkPermission(user, ['user:view-feed']);
		findParams = { published: true };
		sortParams = { publishDate: -1 };
	}

	if (authorized !== true) return authorized;

	if (storyType) {
		// Ensure valid story type
		if (!_validateStoryType(storyType)) {
			return new Error(`The story type ${storyType} is not valid.`);
		}
		else {
			findParams.storyType = storyType;
		}
	}

	const db = await connect();
	return await db.collection('stories').find(findParams).sort(sortParams).skip(skip).limit(limit).toArray();	
}


/**
 * Helper method for validating story type
 * @param {String} storyType 
 */
const _validateStoryType = function(storyType) {
	let valid = false;

	STORY_TYPES.forEach((type) => { 
		if (!valid) {
			if (type === storyType) valid = true;
		}
	});

	return valid;
}


/**
 * Create a story
 * @param {*} user 
 * @param {String} type 
 * @param {String} content 
 * @param {String?} iconName 
 * @param {String?} intent 
 */
const createStory = async function(user, type, content, iconName = '', intent = 'none') {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:modify-feed']);
	if (authorized !== true) return authorized;
	
	// Validate paramters
	if (!type) return new Error('A story type is required');
	if (!content) return new Error('Story content is required');

	// Ensure valid story type
	if (!_validateStoryType(type)) {
		return new Error(`The story type '${type}' is not valid.`);
	}

	const db = await connect();
	
	// Create story object
	const story = {
		_id: new Mongo.ObjectID(),
		type,
		createDate: new Date(),
		createdBy: user.username,
		publishDate: null,
		published: false,
		iconName,
		content,
		intent,
		edited: false,
		likes: []
	}
	db.collection('stories').insert(story);

	// Log action
	const action = {
		action: 'Create story',
		target: story._id,
		targetCollection: 'stories',
		who: user.username,
		date: new Date(),
		infoJSONString: JSON.stringify({
			type,
			iconName,
			content,
			intent
		})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Create a user (basic) story
 * @param {*} user 
 * @param {String} content 
 */
const createUserStory = async function(user, content) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:view-feed']);
	if (authorized !== true) return authorized;
	
	// Validate paramters
	if (!content) return new Error('Story content is required');

	const db = await connect();
	
	// Create story object
	const story = {
		_id: new Mongo.ObjectID(),
		type: 'user',
		createDate: new Date(),
		createdBy: user.username,
		publishDate: null,
		published: false,
		iconName: '',
		content,
		intent: 'none',
		edited: false,
		likes: []
	}
	db.collection('stories').insert(story);

	// Log action
	const action = {
		action: 'Create user story',
		target: story._id,
		targetCollection: 'stories',
		who: user.username,
		date: new Date(),
		infoJSONString: JSON.stringify({ content })
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Edit a story
 * @param {*} user 
 * @param {*} storyId 
 * @param {String} property 
 * @param {String} value 
 */
const editStory = async function(user, storyId, property, value) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:modify-feed']);
	if (authorized !== true) return authorized;
	
	// Validate paramters
	if (!storyId) return new Error('A story id is required');
	if (!property) return new Error('A story property is required');

	// Ensure valid property type
	let valid = false;
	['content', 'iconName', 'intent'].forEach((p) => { 
		if (!valid) { if (p === property) valid = true; }
	});
	if (!valid) return new Error(`The story property '${property}' is not valid.`);

	// Ensure story exists
	const db = await connect();
	
	const story = await db.collection('stories').findOne({ _id: Mongo.ObjectID(storyId) });
	if (!story) return new Error(`The story with the id '${storyId}' does not exist.`);

	// Update story
	const result = await db.collection('stories').update(
		// Selector
		{ _id: Mongo.ObjectID(storyId) },
		// Update
		{ $set: { [property]: value } }
	);

	if (result.result.nModified === 1) {
		// Log action
		const action = {
			action: 'Edit story',
			target: storyId,
			targetCollection: 'stories',
			who: user.username,
			date: new Date(),
			infoJSONString: JSON.stringify({
				property,
				value: value ? value : ''
			})
		};
		db.collection('actions').insert(action);

		return {
			ok: true,
			action: action
		}
	}
	else {
		return new Error(`The property '${property}' of this story already has that value.`);
	}
}


/**
 * Delete a story
 * @param {*} user 
 * @param {String} storyId 
 */
const deleteStory = async function(user, storyId) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:modify-feed']);
	if (authorized !== true) return authorized;
	
	// Validate paramters
	if (!storyId) return new Error('A story id is required');

	// Ensure story exists
	const db = await connect();
	const story = await db.collection('stories').findOne({ _id: Mongo.ObjectID(storyId) });
	if (!story) return new Error(`The story with the id '${storyId}' does not exist.`);

	// Delete story
	db.collection('stories').remove({ _id: Mongo.ObjectID(storyId) });

	// Log action
	const action = {
		action: 'Delete story',
		target: storyId,
		targetCollection: 'stories',
		who: user.username,
		date: new Date(),
		infoJSONString: JSON.stringify({
			content: story.content,
			createDate: story.createDate,
			publishDate: story.publishDate,
			published: story.published,
			createdBy: story.createdBy,
			likes: story.likes.length
		})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Sets a story as published or unpublished
 * @param {*} user 
 * @param {String} storyId 
 * @param {Boolean} publish 
 */
const setStoryPublished = async function(user, storyId, publish) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:modify-feed']);
	if (authorized !== true) return authorized;
	
	// Validate paramters
	if (!storyId) return new Error('A story id is required');

	// Ensure story exists
	const db = await connect();
	const story = await db.collection('stories').findOne({ _id: Mongo.ObjectID(storyId) });
	if (!story) return new Error(`The story with the id '${storyId}' does not exist.`);

	// Check the story is not already published or not published
	if (story.published === publish) return new Error(`The story is ${publish?'already published':'not published'}.`);

	// Update story
	db.collection('stories').update(
		// Selector
		{ _id: Mongo.ObjectID(storyId) },
		// Update
		{ $set: { published: publish, publishDate: new Date() } }
	);

	// Log action
	const action = {
		action: `${publish?'Publish':'Unpublish'} story`,
		target: storyId,
		targetCollection: 'stories',
		who: user.username,
		date: new Date(),
		infoJSONString: JSON.stringify({ publish })
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Add or remove a like by the user on a story
 * @param {*} user 
 * @param {String} storyId 
 * @param {Boolean} like 
 */
const setStoryLike = async function(user, storyId, like) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:view-feed']);
	if (authorized !== true) return authorized;
	
	// Validate paramters
	if (!storyId) return new Error('A story id is required');
	if (like!==true && like!==false) return new Error(`The parameter 'like' must be a boolean.`);
	
	// Ensure story exists
	const db = await connect();
	const story = await db.collection('stories').findOne({ _id: Mongo.ObjectID(storyId) });
	if (!story) return new Error(`The story with the id '${storyId}' does not exist.`);

	let liked = false;
	story.likes.forEach((username) => {
		if (user.username === username) liked = true;
	});

	// Ensure user does not already like the story
	if (like && liked) return new Error(`You have already liked this story.`);

	// Ensure user has already liked the story
	else if (!like && !liked) return new Error(`You cannot unlike this story because you haven't liked it.`);

	// Update story
	db.collection('stories').update(
		// Selector
		{ _id: Mongo.ObjectID(storyId) },
		// Update
		{ [like ? '$push' : '$pull']: { likes: user.username } }
	);

	// Log action
	const action = {
		action: like ? 'Like story' : 'Unlike story',
		target: storyId,
		targetCollection: 'stories',
		who: user.username,
		date: new Date()
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


export default {
	getStories,
	getAllStories,
	createStory,
	createUserStory,
	editStory,
	deleteStory,
	setStoryPublished,
	setStoryLike
}
