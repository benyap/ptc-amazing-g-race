require("babel-core/register");
require("babel-polyfill");

import connect from './connect';


const OVERRIDE = 'owner:override';

/**
 * Check if a user has a required permission.
 * Returns true if the user has the permission,
 * returns an error otherwise.
 * @param {*} user 
 * @param {*} required 
 */
const checkPermission = async function(user, required) {
	const db = await connect();
	const userInfo = await db.collection('users').findOne({ username: user.username });

	for(let i = 0; i < required.length; i++) {
		if (userInfo.permissions.indexOf(required[i]) < 0) {
			if (required[i] !== OVERRIDE)
				return new Error('Permission denied: <' + required[i] + '> required.');
		}
	}
	
	return true;
}


/**
 * Check if a user has one of the accepted roles.
 * Returns true if the intersection of the user's roles and the required roles is greater than 1,
 * returns an error otherwise.
 * @param {*} user
 * @param {*} accepted
 */
const checkRole = async function(user, accepted) {
	const db = await connect();
	const userInfo = await db.collection('users').findOne({username: user.username});

	if (accepted.length > 0) {
		const intersection = accepted.filter((value) => { 
			return userInfo.roles.indexOf(value) > -1;
		});
		if (intersection.length < 1) return new Error('User does not have the correct role access to modify this setting. Accepted roles: ' + accepted);
	}

	return true;
}


export default {
	checkPermission,
	checkRole
};
