import DateFormat from 'dateformat';
import Mongo from 'mongodb';
import connect from '../connect';
import permission from '../permission';

import upload from './upload';
import team from './team';


/**
 * Get challenge responses (admin only)
 * @param {*} user 
 * @param {String} challengeKey
 * @param {String} itemKey
 */
const getResponses = async function(user, challengeKey, itemKey) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:view-responses']);
	if (authorized !== true) return authorized;
		
	const db = await connect();

	if (challengeKey) {
		// Ensure challenge exists
		let challengeCheck = await db.collection('challenges').findOne({key: challengeKey});
		if (!challengeCheck) return new Error(`A challenge with the key '${challengeKey}' does not exist.`);
	}

	let findParams = {};
	if (challengeKey) findParams.challengeKey = challengeKey;
	if (itemKey) findParams.itemKey = itemKey;

	return db.collection('responses').find(findParams).sort({uploadDate:1}).toArray();
}


/**
 * Get a team's responses to a challenge
 * @param {*} user 
 * @param {String} challengeKey
 * @param {String} itemKey
 */
const getTeamResponses = async function(user, challengeKey, itemKey) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['user:access-challenges']);
	if (authorized !== true) return authorized;
	
	// Validate parameters
	if (!challengeKey) return new Error('A challenge key is required.');
	if (!itemKey) return new Error('An item key is required.');
	
	const db = await connect();

	// Ensure challenge exists
	let challengeCheck = await db.collection('challenges').findOne({key: challengeKey});
	if (!challengeCheck) return new Error(`A challenge with the key '${challengeKey}' does not exist.`);

	// Ensure user is in a team 
	let userCheck = await db.collection('users').findOne({username: user.username});
	if (!userCheck.teamId) return new Error(`${user.username} is not in a team.`);

	const findParams = { 
		challengeKey, 
		itemKey, 
		teamId: Mongo.ObjectID(userCheck.teamId)
	};

	return db.collection('responses').find(findParams).sort({uploadDate:-1}).toArray();
}


/**
 * Add a new response to a challenge item
 * @param {*} user 
 * @param {String} challengeKey 
 * @param {String} itemKey 
 * @param {String} responseType 
 * @param {String} responseValue 
 * @param {*} object 
 */
const addResponse = async function(user, challengeKey, itemKey, responseType, responseValue, object) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['user:access-challenges']);
	if (authorized !== true) return authorized;

	// Validate parameters
	if (!challengeKey) return new Error('A challenge key is required.');
	if (!itemKey) return new Error('An item key is required.');
	if (!responseType) return new Error('A response type is required.');
	const typeValues = ['upload', 'phrase'];
	let typeValid = false;
	typeValues.forEach((typeValue) => {
		if (responseType === typeValue) typeValid = true;
	});
	if (!typeValid) return new Error(`The resonse type '${responseType}' is not valid.`);

	const db = await connect();
	
	// Ensure user is in a team 
	let userCheck = await db.collection('users').findOne({username: user.username});
	if (!userCheck.teamId) return new Error(`${username} is not in a team.`);

	// Ensure challenge exists
	let challengeCheck = await db.collection('challenges').findOne({key: challengeKey});
	if (!challengeCheck) return new Error(`A challenge with the key '${challengeKey}' does not exist.`);
	
	// Ensure challenge item exists
	const challengeItemCheck = await db.collection('challenges').findOne({key: challengeKey, 'items.key': itemKey});
	if (!challengeItemCheck) return new Error(`A challenge item with the key '${itemKey}' does not exist.`);

	// Process response
	switch (responseType) {
		case 'upload': {
			if (!object) return new Error('No object uploaded.');
			responseValue = `[${userCheck.teamId}] ${itemKey} ${parseInt(new Date().getTime()/1000)}.${object.mimetype.substring(object.mimetype.indexOf('/')+1)}`;
			const uploadResponse = await upload._uploadObject(user, object, `images/${challengeKey}`, responseValue, responseValue);
			if (!uploadResponse.ok) {
				// FIXME: Improve error handling
				console.log(uploadResponse);
			}
			break;
		}
		case 'phrase': {
			if (!responseValue) return new Error('A response value key is required.');
			break;
		}
	}

	// Save response
	const response = {
		challengeKey: challengeKey,
		itemKey: itemKey, 
		responseType,
		responseValue,
		teamId: userCheck.teamId,
		uploadDate: new Date(),
		uploadedBy: user.username,
		checked: false,
		responseValid: false,
		retry: false,
		checkedBy: null,
		pointsAwarded: 0
	}
	db.collection('responses').insert(response);

	// Log action
	const action = {
		action: `Add response: ${itemKey}`,
		target: challengeKey,
		targetCollection: 'responses',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({challengeKey, itemKey, responseType, responseValue})
	}
	db.collection('actions').insert(action);

	return {
		ok: true,
		action
	}
}


/**
 * Check a challenge item response
 * @param {*} user 
 * @param {String} responseId 
 * @param {Boolean} responseValid 
 * @param {Boolean} retry 
 * @param {Number} pointsAwarded 
 */
const checkResponse = async function(user, responseId, responseValid, retry, pointsAwarded) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:modify-responses']);
	if (authorized !== true) return authorized;

	// Validate parameters
	if (!responseId) return new Error('A response id is required.');
	if (responseValid!==true&&responseValid!==false) return new Error('Invalid response valid value.');
	if (retry!==true&&retry!==false) return new Error('Invalid retry value.');
	if (isNaN(pointsAwarded)) return new Error('Invalid pointsAwarded value.');

	const db = await connect();
	
	// Check that response exists
	const responseCheck = await db.collection('responses').findOne({_id: Mongo.ObjectID(responseId)});
	if (!responseCheck) return new Error(`A response with the key '${responseCheck}' does not exist.`);
	
	// Update response
	const difference = -responseCheck.pointsAwarded + pointsAwarded;
	db.collection('responses').update(
		// Selector
		{_id: Mongo.ObjectID(responseId)},
		// Update
		{ $set: { responseValid, retry, pointsAwarded, checked: true, checkedBy: user.username } }
	);

	// Update team points if necessary
	if (difference !== 0) {
		team.addTeamPoints(user, responseCheck.teamId, difference);
	}

	// Log action
	const action = {
		action: `Check response`,
		target: responseId,
		targetCollection: 'responses',
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({
			challengeKey: responseCheck.challengeKey,
			itemKey: responseCheck.itemKey,
			responseValid,
			retry, 
			pointsAwarded
		})
	}
	db.collection('actions').insert(action);

	return {
		ok: true,
		action
	}
}


export default {
	getResponses,
	getTeamResponses,
	addResponse,
	checkResponse
}
