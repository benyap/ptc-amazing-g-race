require("babel-core/register");
require("babel-polyfill");

import bcrypt from 'bcryptjs';
import Mongo from 'mongodb';
import connect from '../connect';
import permission from '../permission';


/**
 * Get the a user from the database by Id
 * @param {*} user 
 * @param {String} userId 
 */
const getUserById = async function(user, userId) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['user:view-users']);
		if (authorized !== true) return authorized;
		
		const db = await connect();
		return db.collection('users').findOne({_id: Mongo.ObjectID(userId)});
	}
}


/**
 * Get the a user from the database by username
 * @param {*} user 
 * @param {String} username 
 */
const getUserByUsername = async function(user, username) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['user:view-users']);
		if (authorized !== true) return authorized;
		
		const db = await connect();
		return db.collection('users').findOne({ username:username.toLowerCase() });
	}	
}


/**
 * Get the a user from the database by email
 * @param {*} user 
 * @param {String} email 
 */
const getUserByEmail = async function(user, email) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['user:view-users']);
		if (authorized !== true) return authorized;

		const db = await connect();
		return db.collection('users').findOne({email:email.toLowerCase()});
	}
}


/**
 * Get the current logged in user
 * @param {*} user 
 */
const getMe = async function(user) {
	if (!user) return new Error('No user logged in');
	else {
		const db = await connect();
		return db.collection('users').findOne({_id: Mongo.ObjectID(user.userId)});
	}
}


/**
 * Check if a user parameter is unique in the database
 * @param {*} user
 * @param {String} parameter
 * @param {String} value
 */
const checkUnique = async function(user, parameter, value) {
	const db = await connect();
	let result = await db.collection('users').findOne({[parameter]: value.toLowerCase()});
	if (result) {
		return {
			ok: false,
			failureMessage: parameter[0].toUpperCase() + parameter.slice(1) + ' already exists in database'
		}
	}
	else return {
		ok: true
	}
}


/**
 * Get a list of all users
 * @param {*} user 
 */
const listAll = async function(user, skip = 0, limit = 0) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['user:view-users']);
		if (authorized !== true) return authorized;
		
		const db = await connect();
		return db.collection('users').find({}).skip(skip).limit(limit).toArray();
	}
}


/**
 * Check if the specified use has permission
 * @param {*} user
 * @param {String} username
 * @param {String} permission
 */
const checkUserPermission = async function(user, username, permission) {
	if (!user) return new Error('No user logged in');
	else {
		const db = await connect();
		const userToCheck = await db.collection('users').findOne({ username });

		if (!userToCheck) {
			return new Error('User \'' + username + '\' not found');
		}
		else {
			if (userToCheck.permissions.indexOf(permission) < 0) {
				return { username, permission, ok: false };
			}
			else {
				return { username, permission, ok: true };
			}
		}
	}
}


/**
 * Add a permission to a user
 * @param {*} user
 * @param {String} username
 * @param {String} permission
 */
const addPermission = async function(user, username, permission) {
	return _modifyProperty('Add', 'permission', user, username, permission);
}


/**
 * Remove a permission from a user
 * @param {*} user
 * @param {String} username
 * @param {String} permission
 */
const removePermission = async function(user, username, permission) {
	return _modifyProperty('Remove', 'permission', user, username, permission);
}


/**
 * Add a role to a user
 * @param {*} user
 * @param {String} username
 * @param {String} role
 */
const addRole = async function(user, username, role) {
	return _modifyProperty('Add', 'role', user, username, role);
}


/**
 * Remove a role from a user
 * @param {*} user
 * @param {String} username
 * @param {String} role
 */
const removeRole = async function(user, username, role) {
	return _modifyProperty('Remove', 'role', user, username, role);
}


/**
 * Generic method for modifying a user property (role or permission). 
 * Provide the argument 'Add' as the modifyAction to add a property,
 * or provide the argument 'Remove' as the modifyAction to remove a property.
 * @param {String} modifyAction
 * @param {String} mofidyProperty
 * @param {*} user
 * @param {String} username
 * @param {String} property
 */
const _modifyProperty = async function(modifyAction, modifyProperty, user, username, property) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['admin:modify' + modifyProperty + '-user']);
		if (authorized !== true) return authorized;

		const db = await connect();
		const userToModify = await db.collection('users').findOne({ username });

		if (!userToModify) {
			return new Error('User \'' + username + '\' not found');
		}
		else {
			let proceed;
			let updateAction;
			let errorPhrase;

			// Check what action to take
			if (modifyAction === 'Add') {
				proceed = userToModify[modifyProperty + 's'].indexOf(property) < 0;
				updateAction = '$push';
				errorPhrase = 'already has'
			}
			else if (modifyAction === 'Remove') {
				proceed = userToModify[modifyProperty + 's'].indexOf(property) >= 0;
				updateAction = '$pull';
				errorPhrase = 'does not have';
			}
			else throw new Error('Invalid argument in modify ' + modifyProperty + ' function: ' + action);

			// Modify the user's properties accordingly
			if (!proceed) {
				return new Error('User \'' + username + '\' ' + errorPhrase + ' the ' + modifyProperty + ' <' + property + '>');			
			}
			else {
				// Update user
				const result = await db.collection('users').update(
					// Selector
					{ username },
					// Update
					{ [updateAction]: { [modifyProperty + 's']: property } }
				);

				if (result.result.nModified === 1) {
					// Log action
					const action = {
						action: modifyAction + ' ' + modifyProperty,
						target: username,
						targetCollection: 'users',
						date: new Date(),
						who: user.username,
						infoJSONString: JSON.stringify({ username, [modifyProperty]: property })
					};

					db.collection('actions').insert(action);
					
					return { 
						ok: true,
						action: action
					}
				}
				else {
					return new Error('Unable to modify user ' + modifyProperty);
				}
			}
		}
	}
}


/**
 * Register a new user to the databse.
 * Must have a unique username and email.
 */
const registerUser = async function(user, {firstname, lastname, username, studentID, university, email, mobileNumber, password, confirmPassword, publicTransport, smartphone, friends}) {
	if (user) {
		return new Error('User cannot be logged in');
	}
	else {
		// Validate parameters
		let errors = [];

		if (!firstname) errors.push(new Error('First name is required'));

		if (!lastname) errors.push(new Error('Last name is required'));
		
		if (!username) errors.push(new Error('Username is required'));
		else if (username.length < 3) errors.push(new Error('Username must be longer than 3 characeters'));

		if (!email) errors.push(new Error('Email is required'));
		else {
			// Test email with regex
			let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (!regex.test(email)) errors.push(new Error('Invalid email'));
		}

		if (!password) errors.push(new Error('Password is required'));
		else if (password.length < 6) errors.push(new Error('Password must be longer than 6 characeters'));
		
		if (!confirmPassword) errors.push(new Error('Confirm password is required'));
		else if (password !== confirmPassword) errors.push(new Error('Passwords do not match'));

		if (!studentID) errors.push(new Error('Student ID is required'));

		if (!university) errors.push(new Error('University is required'));

		if (!mobileNumber) errors.push(new Error('Mobile number is required'));
		else {
			let regex = /^([0-9 ]{10,15})$/;
			if (!regex.test(mobileNumber)) errors.push(new Error('Invalid phone number'));
		}


		// Return errors if any were found
		if (errors.length) return new Error(errors);


		// Check uniqueness of username and email
		const db = await connect();
		
		const usernameCheck = await db.collection('userauthentications').findOne({ username: username.toLowerCase() });
		if (usernameCheck) return new Error('Username \'' + username + '\' already taken');

		const emailCheck = await db.collection('userauthentications').findOne({ email: email.toLowerCase() });
		if (emailCheck) return new Error('Email \'' + email + '\' already taken');


		// Create user
		const newUser = {
			firstname,
			lastname,
			studentID,
			university,
			username: username.toLowerCase(),
			email: email.toLowerCase(),
			mobileNumber: mobileNumber,
			enabled: true,
			paid: false,
			raceDetails: {
				publicTransport, smartphone, friends
			},
			permissions: [],
			roles: [],
			registerDate: new Date()
		};

		// Create user account
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		const newUserAuthentication = {
			username: username.toLowerCase(),
			email: email.toLowerCase(),
			password: hash
		};
		
		// Save user details
		await db.collection('users').insert(newUser);
		await db.collection('userauthentications').insert(newUserAuthentication);
		
		return db.collection('users').findOne({email: email.toLowerCase(), username: username.toLowerCase()});
	}
}


/**
 * Get the user's actions
 * @param {*} user
 * @param {String} action
 * @param {Number} skip
 * @param {Number} limit
 */
const getUserActions = async function(user, action, skip = 0, limit = 0) {
	if (!user) return new Error('No user logged in');
	else {
		let findParams = { who: user.username };

		if (limit < 0) return new Error('Limit value must be non-negative, but received: ' + limit);
		
		if (action) {
			const escapedAction = action.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');			
			const actionRegex = new RegExp(['^', escapedAction, '$'].join(''), 'i');
			findParams.action = actionRegex;
		}

		const db = await connect();
		return db.collection('actions').find(findParams).sort({date: -1}).skip(skip).limit(limit).toArray();
	}
}


/**
 * Get actions
 * @param {*} user
 * @param {String} username
 * @param {String} action
 * @param {Number} skip
 * @param {Number} limit
 */
const getActions = async function(user, username, action, skip = 0, limit = 0) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['leader:view-useractions']);
		if (authorized !== true) return authorized;

		let findParams = {};
		
		if (action) {
			const escapedAction = action.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
			const actionRegex = new RegExp(['^', escapedAction, '$'].join(''), 'i');
			findParams.action = actionRegex;
		}
		
		if (limit < 0) return new Error('Limit value must be non-negative, but received: ' + limit);
		
		const db = await connect();

		if (username) {
			let userCheck = await db.collection('users').findOne({username});
			if (!userCheck) return new Error('User \'' + username + '\' not found');
			else findParams.who = username;
		}
		
		return db.collection('actions').find(findParams).sort({date: -1}).skip(skip).limit(limit).toArray();
	}
}


/**
 * Set the enabled status of a user
 * @param {*} user
 * @param {String} username
 * @param {Boolean} enabled
 */
const setUserEnabled = async function(user, username, enabled) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['admin:modifypermission-user']);
		if (authorized !== true) return authorized;

		// Verify that enabled is valid
		if (enabled !== true && enabled !== false) {
			return new Error('Invalid enabled argument');
		}
		else {
			// Verify that user exists
			const db = await connect();
			const userToModify = await db.collection('users').findOne({username: username});
			
			if (!userToModify) return new Error('User \'' + username + '\' not found');

			if (enabled === userToModify.enabled) return new Error('User already ' + (enabled ? 'enabled' : 'disabled'));

			if (!enabled) {
				// Revoke all refresh tokens
				db.collection('refreshtokens').update(
					// Selector
					{ email: user.email, valid: true },
					// Update
					{ $set: { valid: false, invalidatedOn: Date.now() } }
				,
				(err, result) => {
					console.log('Revoked ' + result.result.nModified + ' refresh token(s)');
				});
			}

			// Set the enabled status
			const result = await db.collection('users').update(
				// Selector
				{ username: username },
				// Update
				{ $set: { enabled: enabled } }
			);

			if (result.result.nModified === 1) {
				// Log permission action
				const action = {
					action: enabled ? 'Enable user' : 'Disable user',
					target: username,
					targetCollection: 'users',
					date: new Date(),
					who: user.username,
				};

				db.collection('actions').insert(action);
				
				return { 
					ok: true,
					action: action
				}
			}
			else {
				return new Error('Unable to modify user enabled status');
			}
		}
	}
}

const setUserPaidAmount = async function(user, username, amount) {
	if (!user) return new Error('No user logged in');
	else {
		const authorized = await permission.checkPermission(user, ['admin:modifystatus-user']);
		if (authorized !== true) return authorized;

		// Verify that amount is valid
		if (isNaN(parseFloat(amount))) {
			return new Error('Invalid amount argument');
		}
		else {
			// Verify that user exists
			const db = await connect();
			const userToModify = await db.collection('users').findOne({username: username});
			
			if (!userToModify) return new Error('User \'' + username + '\' not found');

			// Set the paid amount
			const result = await db.collection('users').update(
				// Selector
				{ username: username },
				// Update
				{ $set: { paidAmount: amount } }
			);

			if (result.result.nModified === 1) {
				// Log permission action
				const action = {
					action: 'Set paid amount',
					target: username,
					targetCollection: 'users',
					date: new Date(),
					who: user.username
				};

				db.collection('actions').insert(action);
				
				return { 
					ok: true,
					action: action
				}
			}
			else {
				return new Error('Unable to modify user paid amount.');
			}
		}
	}
}


export default {
	getUserById,
	getUserByUsername,
	getUserByEmail,
	getMe,
	checkUnique,
	listAll,
	checkUserPermission,
	addPermission,
	removePermission,
	addRole,
	removeRole,
	registerUser,
	getUserActions,
	getActions,
	setUserEnabled,
	setUserPaidAmount
}
