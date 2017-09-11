import database from '../../db';


const getSetting = async function(root, params, ctx, options) {
	return database.setting.getSetting(ctx.user, params.key);
}

const getPublicSetting = async function(root, params, ctx, options) {
	return database.setting.getPublicSetting(params.key);
}

const getSettings = async function(root, params, ctx, options) {
	return database.setting.getSettings(ctx.user, params.skip, params.limit);
}

const setSetting = async function(root, params, ctx, options) {
	return database.setting.setSetting(ctx.user, params.key, params.value);	
}

const addSetting = async function(root, params, ctx, options) {
	return database.setting.addSetting(ctx.user, params.key, params.value);
}

const removeSetting = async function(root, params, ctx, options) {
	return database.setting.removeSetting(ctx.user, params.key, params.value);
}


export default {
	getSetting,
	getPublicSetting,
	getSettings,
	setSetting,
	addSetting,
	removeSetting,
};
