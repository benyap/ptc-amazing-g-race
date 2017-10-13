import Mongo from 'mongodb';
import connect from '../connect';
import permission from '../permission';


/**
 * Create a new challenge
 * @param {*} user 
 * @param {String} key 
 * @param {String} group
 * @param {String} type 
 * @param {String} passphrase 
 */
const createChallenge = async function(user, key, order, passphrase = null, title = '', description = '') {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:create-challenge']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!key) return new Error('A challenge key is required.');
	if (order === null || order.length < 1) return new Error('A challenge order is required.');
	else if (isNaN(parseInt(order))) return new Error('Challenge order must be a valid integer');

	const db = await connect();

	// Ensure challenge key unique
	let challengeCheck = await db.collection('challenges').findOne({key});
	if (challengeCheck) return new Error(`A challenge with the key '${key}' already exists.`);
	
	// Create new challenge
	const challenge = {
		key: key,
		order: order,
		public: passphrase ? false : true,
		passphrase: passphrase,
		title: title,
		description: description,
		locked: false,
		items: [],
		teams: []
	};
	db.collection('challenges').insert(challenge);

	// Log action
	const action = {
		action: 'Create challenge',
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({ key: key, order: order, public: challenge.public, passphrase: challenge.passphrase })
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Delete a challenge
 * @param {*} user 
 * @param {String} key 
 */
const deleteChallenge = async function(user, key) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:delete-challenge']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!key) return new Error('A challenge key is required.');

	const db = await connect();

	// Ensure challenge key exists
	let challengeCheck = await db.collection('challenges').findOne({key});
	if (!challengeCheck) return new Error(`A challenge with the key '${key}' does not exist.`);

	//Remove the challenge
	db.collection('challenges').remove({key});

	// Log action
	const action = {
		action: 'Delete challenge',
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Edit a challenge's property
 * @param {*} user 
 * @param {*} key 
 * @param {*} property 
 * @param {*} value 
 */
const _editChallengeProperty = async function(user, key, property, value) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:edit-challenge']);
	if (authorized !== true) return authorized;

	if (!key) return new Error('A challenge key is required.');

	// Ensure property being edited is valid
	const editableProperties = [
		'type',
		'order',
		'public',
		'passphrase',
		'title',
		'description',
		'locked'
	];

	let valid = false;
	editableProperties.forEach((p) => { if (!valid) if (p === property) valid = true; });
	if (!valid) return new Error(`The property ${property} is not valid.`);

	const db = await connect();

	// Ensure challenge key exists
	let challengeCheck = await db.collection('challenges').findOne({key});
	if (!challengeCheck) return new Error(`A challenge with the key '${key}' does not exist.`);
	
	// Convert passphrase to lowercase
	if (property === 'passphrase') value = value.toLowerCase();

	//Update the challenge property
	db.collection('challenges').update({key}, { $set: { [property]: value } });
	
	// Log action
	const action = {
		action: `Edit challenge property: ${property}`,
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({property, value})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Get all challenges (admin only)
 * @param {*} user 
 */
const getAllChallenges = async function(user) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:view-allchallenges']);
	if (authorized !== true) return authorized;

	const db = await connect();
	return db.collection('challenges').find().sort({order: 1}).toArray();
}


/**
 * Get the challenges this user is permitted to see
 * @param {*} user
 */
const getChallenges = async function(user) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:view-challenges']);
	if (authorized !== true) return authorized;

	const db = await connect();

	const userProfile = await db.collection('users').findOne({username: user.username});
	return db.collection('challenges').find({ 
		$or: [{ teams: userProfile.teamId.toString() }, { public: true }]
	}).sort({order: 1}).toArray();
}


/**
 * Get a challenge (permitted users and admins only)
 * @param {*} user 
 * @param {*} key 
 */
const getChallenge = async function(user, key) {
	if (!user) return new Error('No user logged in');
	
	let isAdmin = false;

	const adminAuthorized = await permission.checkPermission(user, ['admin:view-allchallenges']);
	if (adminAuthorized == true) isAdmin = true;

	if (!isAdmin) {
		const authorized = await permission.checkPermission(user, ['user:view-challenges']);
		if (authorized !== true) return authorized;
	}
	
	const db = await connect();
	
	const userProfile = await db.collection('users').findOne({username: user.username});
	
	if (isAdmin) {
		return db.collection('challenges').findOne({ key });
	}
	else {
		return db.collection('challenges').findOne({ 
			key,
			$or: [{ teams: userProfile.teamId.toString() }, { public: true }]
		});
	}
}

/**
 * Get a challenge by its Id (permitted users only)
 * @param {*} user 
 * @param {*} id 
 */
const getChallengeById = async function(user, id) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:view-challenges']);
	if (authorized !== true) return authorized;

	const db = await connect();
	
	const userProfile = await db.collection('users').findOne({username: user.username});
	
	return db.collection('challenges').findOne({ 
		_id: Mongo.ObjectID(id),
		$or: [{ teams: userProfile.teamId.toString() }, { public: true }]
	});
}


/**
 * Add a team to the list of unlocked teams
 * @param {*} user
 * @param {String} key
 * @param {String} teamId
 */
const addTeamToUnlocked = async function(user, key, teamId) {
	return _modifyTeams('add', user, key, teamId);
}


/**
 * Remove a team from the list of unlocked teams
 * @param {*} user
 * @param {String} key
 * @param {String} teamId
 */
const removeTeamFromUnlocked = async function(user, key, teamId) {
	return _modifyTeams('remove', user, key, teamId);
}


const _modifyTeams = async function(modifyAction, user, key, teamId) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:modify-challenge-access']);
	if (authorized !== true) return authorized;
	
	// Ensure challenge exists
	const db = await connect();
	const challenge = await db.collection('challenges').findOne({key});
	if (!challenge) return new Error(`The challenge with the key '${key}' does not exist.`);

	// Ensure the team exists
	const teamCheck = await db.collection('teams').findOne({_id: Mongo.ObjectID(teamId)});
	if (!teamCheck) return new Error(`The team with the id '${teamId}' does not exist.`);

	let modifyActionDb;
	let found = false;

	// Find the teamId in the challenge list
	challenge.teams.forEach(id => {
		if (!found) { if (id.toString() === teamId) found = true; }
	});

	if (modifyAction === 'add') {
		// Ensure the team is not already in the list
		if (found) return new Error(`The team with the id '${teamId}' is already permitted to view this challenge.`);
		
		modifyActionDb = '$push';
	}
	else if (modifyAction === 'remove') {
		// Ensure that the team is in the list
		if (!found) return new Error(`The team with the id '${teamId}' is already not permitted to view this challenge.`);
		
		modifyActionDb = '$pull';
	}
	else return new Error(`Modification action ${action} not recognized.`);

	const result = await db.collection('challenges').update(
		// Selector
		{ key: key },
		// Update
		{ [modifyActionDb]: { teams: teamId } }
	);

	// Log action
	const action = {
		action: `Modify challenge access`,
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({teamId, modifyAction})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Create a new challenge item and add it to a challenge
 * @param {*} user 
 * @param {String} key 
 * @param {String} itemKey 
 * @param {String} title 
 * @param {Number} order 
 */
const createChallengeItem = async function(user, key, itemKey, title, order, type) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:edit-challenge']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!key) return new Error('A challenge key is required.');
	if (!itemKey) return new Error('A challenge item key is required.');
	if (!title) return new Error('A challenge item title is required.');
	if (order === null || order.length < 1) return new Error('A challenge order is required.');
	else if (isNaN(order)) return new Error('Challenge order must be a valid integer.');

	const typeValues = ['upload', 'phrase'];
	let typeValid = false;
	typeValues.forEach((typeValue) => {
		if (type === typeValue) typeValid = true;
	});
	if (!typeValid) return new Error(`The type '${type}' is not valid.`);
	
	// Check that challenge exists
	const db = await connect();
	const challenge = await db.collection('challenges').findOne({key});
	if (!challenge) return new Error(`The challenge with the key '${key}' does not exist.`);

	// Check that challenge key doesn't exists already
	const challengeItemCheck = await db.collection('challenges').findOne({key, 'items.key': itemKey});
	if (challengeItemCheck) return new Error(`A challenge item with the key '${itemKey}' already exists.`);
	
	// Create challenge item
	const item = {
		key: itemKey,
		title: title,
		description: '',
		type: type,
		order: order
	}

	db.collection('challenges').update(
		// Selector
		{ key: key },
		// Update
		{ $push: { items: item } }
	);
	
	// Log action
	const action = {
		action: `Add challenge item`,
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({key: itemKey, title, type})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Deletes a challenge item from a challenge
 * @param {*} user 
 * @param {String} key 
 * @param {String} itemKey 
 */
const deleteChallengeItem = async function(user, key, itemKey) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:edit-challenge']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!key) return new Error('A challenge key is required.');
	if (!itemKey) return new Error('A challenge item key is required.');

	// Check that challenge exists
	const db = await connect();
	const challenge = await db.collection('challenges').findOne({key});
	if (!challenge) return new Error(`The challenge with the key '${key}' does not exist.`);
	
	// Remove item
	const result = await db.collection('challenges').update(
		// Selector
		{ key: key },
		// Update
		{ $pull: { items: { key: itemKey } } }
	);
	
	if (result.result.nModified == 0) 
		return new Error(`Challenge item with the key '${itemKey}' was not found in the challenge '${key}'`);		

	// Log action
	const action = {
		action: `Delete challenge item`,
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({itemKey})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Modify a challenge item property
 * @param {*} user 
 * @param {String} key 
 * @param {String} itemKey 
 * @param {String} property 
 * @param {String} value 
 */
const _editChallengeItemProperty = async function(user, key, itemKey, property, value) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:edit-challenge']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!key) return new Error('A challenge key is required.');

	// Ensure property being edited is valid
	const editableProperties = [
		'order',
		'title',
		'description'
	];

	let valid = false;
	editableProperties.forEach((p) => { if (!valid) if (p === property) valid = true; });
	if (!valid) return new Error(`The property ${property} is not valid.`);

	// Check that challenge exists
	const db = await connect();
	const challenge = await db.collection('challenges').findOne({key});
	if (!challenge) return new Error(`The challenge with the key '${key}' does not exist.`);

	// Check that challenge with the item key exists
	const challengeItemCheck = await db.collection('challenges').findOne({key, 'items.key': itemKey });
	if (!challengeItemCheck) return new Error(`A challenge item with the key '${itemKey}' does not exist in the challenge '${key}'.`);

	// Update the challenge item
	const result = await db.collection('challenges').update(
		// Selector
		{ key: key, 'items.key': itemKey },
		// Update
		{ $set: { [`items.$.${property}`]: value } }
	);
	
	if (result.result.nModified == 0) 
		return new Error(`Challenge item with the id '${itemKey}' already has the value '${value}' for the property '${property}'`);

	// Log action
	const action = {
		action: `Modify challenge item: ${property}`,
		target: key,
		targetCollection: 'challenges',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({itemKey, property, value})
	};
	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


/**
 * Attempt to unlock a challenge
 * @param {*} user 
 * @param {String} phrase 
 */
const unlockAttempt = async function(user, phrase) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['user:access-challenges']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!phrase) return new Error('A phrase is required.');

	const db = await connect();

	// Check that the user is in a team
	const userCheck = await db.collection('users').findOne({username: user.username});
	if (!userCheck.teamId) return new Error(`You are not in a team.`);

	const team = await db.collection('teams').findOne({_id:Mongo.ObjectID(userCheck.teamId)});

	// Check if the phrase exists
	const challenge = await db.collection('challenges').findOne({ public: false, passphrase: phrase.toLowerCase() });

	if (!challenge) {
		// Phrase not found
		// Log action
		const action = {
			action: 'Incorrect passphrase entered',
			target: 'null',
			targetCollection: 'null',
			date: new Date(),
			who: user.username,
			infoJSONString: JSON.stringify({ phraseEntered: phrase, teamId: team._id, teamName: team.teamName })
		};
		db.collection('actions').insert(action);

		return {
			ok: false,
			failureMessage: 'Incorrect passphrase entered.'
		}
	}
	else {
		// Phrase found
		// Check if team is already unlocked
		let found = false;
		challenge.teams.forEach(id => {
			if (!found) { if (id.toString() === userCheck.teamId.toString()) found = true; }
		});

		if (found) {
			return {
				ok: false,
				failureMessage: 'You have already used this passphrase!'
			}
		}

		// Add team to challenge
		const result = await db.collection('challenges').update(
			// Selector
			{ key: challenge.key },
			// Update
			{ $push: { teams: userCheck.teamId.toString() } }
		);
		
		// Log action
		const action = {
			action: 'Correct passphrase entered',
			target: challenge.key,
			targetCollection: 'challenges',
			date: new Date(),
			who: user.username,
			infoJSONString: JSON.stringify({ 
				phraseEntered: phrase, 
				teamId: team._id, 
				teamName: team.teamName,
				challengeKey: challenge.key
			})
		};
		db.collection('actions').insert(action);
	
		return {
			ok: true,
			action: action
		}
	}
}


export default {
	createChallenge,
	deleteChallenge,
	_editChallengeProperty,
	getAllChallenges,
	getChallenges,
	getChallenge,
	getChallengeById,
	addTeamToUnlocked,
	removeTeamFromUnlocked,
	createChallengeItem,
	deleteChallengeItem,
	_editChallengeItemProperty,
	unlockAttempt
}
