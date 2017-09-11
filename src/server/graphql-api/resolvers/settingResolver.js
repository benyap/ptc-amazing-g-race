import database from '../../db';


// Get setting
const getSetting = async function(root, params, ctx, options) {
	return database.setting.getSetting(ctx.user, params.key);
}

// Get settings
const getSettings = async function(root, params, ctx, options) {
	return database.setting.getSettings(ctx.user, params.skip, params.limit);
}

// Set a setting
const setSetting = async function(root, params, ctx, options) {
	return database.setting.setSetting(ctx.user, params.key, params.value);	
}

// Add a value to a setting
const addSetting = async function(root, params, ctx, options) {
	return database.setting.addSetting(ctx.user, params.key, params.value);
}

// Remove a value from a setting
const removeSetting = async function(root, params, ctx, options) {
	return database.setting.removeSetting(ctx.user, params.key, params.value);
}


export default {
	getSetting,
	getSettings,
	setSetting,
	addSetting,
	removeSetting,
};
