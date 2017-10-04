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
const createChallenge = async function(user, key, group, type, passphrase = null, title = '', description = '') {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:create-challenge']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!key) return new Error('A challenge key is required.');
	if (!type) return new Error('A challenge type is required.');

	const db = await connect();

	// Ensure challenge key unique
	let challengeCheck = await db.collection('challenges').findOne({key});
	if (challengeCheck) return new Error(`A challenge with the key '${key}' already exists.`);
	
	// Create new challenge
	const challenge = {
		key: key,
		group: group,
		type: type,
		public: passphrase ? false : true,
		passphrase: passphrase,
		title: title,
		description: description,
		locked: false,
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
		infoJSONString: JSON.stringify({ public: challenge.public, passphrase: challenge.passphrase })
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
		'group',
		'type',
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
	
	//Update the challenge property
	db.collection('challenges').update({key}, { $set: { [property]: value } });
	
	// Log action
	const action = {
		action: `Edit challenge ${property}`,
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
 * Get all challenges (admin only)
 * @param {*} user 
 */
const getAllChallenges = async function(user) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:view-allchallenges']);
	if (authorized !== true) return authorized;

	const db = await connect();
	return db.collection('challenges').find().toArray();
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
	}).toArray();
}


/**
 * Get a challenge (permitted users only)
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


export default {
	createChallenge,
	deleteChallenge,
	_editChallengeProperty,
	getAllChallenges,
	getChallenges,
	getChallenge,
	addTeamToUnlocked,
	removeTeamFromUnlocked
}
