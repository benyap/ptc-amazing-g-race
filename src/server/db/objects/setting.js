require("babel-core/register");
require("babel-polyfill");

import connect from '../connect';
import permission from '../permission';


/**
 * Get a setting value
 * @param {*} user 
 * @param {String} key
 */
const getSetting = async function(user, key) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:view-setting']);	
	if (authorized !== true) return authorized;

	// Get setting value
	const db = await connect();
	const setting = await db.collection('settings').findOne({ key });

	if (!setting) return new Error('Setting not found');

	return setting;
}


/**
 * Get a setting value that is public and unprotected
 * @param {*} user 
 * @param {String} key
 */
const getPublicSetting = async function(key) {
	return _getPublicSetting(key, false);
}


/**
 * Get a setting value that is public and protected
 * @param {*} key 
 */
const getProtectedSetting = async function(user, key) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['user:view-protectedSettings']);
	if (authorized !== true) return authorized;

	return _getPublicSetting(key, true);
}


/**
 * Get a setting value
 * @param {*} key 
 * @param {Boolean} isProtected 
 */
const _getPublicSetting = async function(key, isProtected) {
	// Get setting value
	const db = await connect();
	const setting = await db.collection('settings').findOne({ key, public: true, 'protected': isProtected });

	if (!setting) return new Error('Setting not found');

	return setting;
}


/**
 * Get list of settings
 * @param {*} user 
 * @param {Number} skip
 * @param {Number} skip
 */
const getSettings = async function(user, skip = 0, limit = 0) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:view-setting']);	
	if (authorized !== true) return authorized;

	// Get settings
	const db = await connect();
	return db.collection('settings').find({}).skip(skip).limit(limit).toArray();
}


/**
 * Set the value of a setting
 * @param {*} user 
 * @param {String} key
 * @param {String} value
 */
const setSetting = async function(user, key, value) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:modify-setting']);	
	if (authorized !== true) return authorized;

	// Ensure setting exists
	const db = await connect();
	const setting = await db.collection('settings').findOne({ key });
	if (!setting) return new Error('Setting not found');

	// Check that it is a single value setting
	if (setting.value === null) return new Error('Cannot set the value of a multi-value setting');

	// Ensure user has the correct role
	const hasRole = await permission.checkRole(user, setting.modifiableRoles);
	if (hasRole !== true) return hasRole;

	// Ensure that value being set is valid
	switch (setting.valueType) {
		case 'string':
			break;
		case 'integer':
			value = parseInt(value);
			if (isNaN(value)) return new Error('Invalid value passed for setting of type integer');
			break;
		case 'float':
			value = parseFloat(value);
			if (isNaN(value)) return new Error('Invalid value passed for setting of type float');
			break;
	}

	// Make sure there is a modification to update
	if (setting.value === value) return new Error(`Setting \'${key}\' already has that value`);

	// Set the setting
	const result = await db.collection('settings').update(
		// Selector
		{ key: key }, 
		// Update
		{ 
			$set: { 
				value: value,
				modified: new Date(),
				modifiedBy: user.username
			} 
		}
	);
	
	if (result.result.nModified === 1) {
		// Log action
		const action = {
			action: 'Modify setting',
			target: key,
			targetCollection: 'settings',
			who: user.username,
			date: new Date(),
			infoJSONString: JSON.stringify({
				action: 'set',
				value: value
			})
		};
		db.collection('actions').insert(action);
		
		return {
			ok: true,
			action: action
		}
	}
	else {
		return new Error(`Unable to modify setting \'${key}\'`);
	}
}


/**
 * Add a value to a setting
 * @param {*} user 
 * @param {String} key
 * @param {String} value
 */
const addSetting = async function(user, key, value) {
	return _modifySettingList('add', user, key, value);
}


/**
 * Remove a value from a setting
 * @param {*} user 
 * @param {String} key
 * @param {String} value
 */
const removeSetting = async function(user, key, value) {
	return _modifySettingList('remove', user, key, value);	
}


const _modifySettingList = async function(modifyAction, user, key, value) {
	let errorString;
	let modification;
	if (modifyAction === 'add') {
		errorString = 'add a value to';
		modification = '$push';
	}
	else if (modifyAction === 'remove') {
		errorString = 'remove a value from';
		modification = '$pull';
	}
	else throw new Error('Invalid modify setting list argument action: ' + modifyAction);

	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:modify-setting']);	
	if (authorized !== true) return authorized;

	// Ensure setting exists	
	const db = await connect();
	const setting = await db.collection('settings').findOne({ key });
	if (!setting) return new Error(`Setting \'${key}\' not found`);

	// Check that it is a multi-value setting
	if (!setting.values) return new Error(`Cannot ${errorString} a single-value setting`);

	// Ensure user has the correct role
	const hasRole = await permission.checkRole(user, setting.modifiableRoles);
	if (hasRole !== true) return hasRole;

	// Ensure that value being set is valid
	switch (setting.valueType) {
		case 'stringList':
			break;
		case 'integerList':
			value = parseInt(value);
			if (isNaN(value)) return new Error('Invalid value passed for setting of type integer');
			break;
		case 'floatList':
			value = parseFloat(value);
			if (isNaN(value)) return new Error('Invalid value passed for setting of type float');
			break;
	}

	// Make sure there is a modification to update
	if (modifyAction === 'add') {
		if (setting.values.indexOf(value) >= 0) return new Error(`Value \'${value}\' already exists in setting`);
	}
	else if (modifyAction === 'remove') {
		if (setting.values.indexOf(value) < 0) return new Error(`Value \'${value}\' does not exist in setting`);
	}

	// Modify the setting
	const result = await db.collection('settings').update(
		// Selector
		{ key: key }, 
		// Update
		{ 
			[modification]: { 
				values: value 
			},
			$set: {
				modified: new Date(),
				modifiedBy: user.username	
			}
		}
	);
		
	if (result.result.nModified === 1) {
		// Log action
		const action = {
			action: 'Modify setting',
			target: key,
			targetCollection: 'settings',
			who: user.username,
			date: new Date(),
			infoJSONString: JSON.stringify({
				action: modifyAction,
				value: value
			})
		};
		db.collection('actions').insert(action);

		return {
			ok: true,
			action: action
		}
	}
	else {
		return new Error(`Unable to modify setting \'${key}\'`);
	}
}


export default {
	getSetting,
	getPublicSetting,
	getProtectedSetting,
	getSettings,
	setSetting,
	addSetting,
	removeSetting
}
