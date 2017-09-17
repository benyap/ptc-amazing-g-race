import database from '../../db';


const getUserById = async function(root, params, ctx, options) {
	return database.user.getUserById(ctx.user, params.userId);
}

const getUserByUsername = async function(root, params, ctx, options) {
	return database.user.getUserByUsername(ctx.user, params.username);
}

const getUserByEmail = async function(root, params, ctx, options) {
	return database.user.getUserByEmail(ctx.user, params.email);
}

const getMe = async function(root, params, ctx, options) {
	return database.user.getMe(ctx.user);
}

const checkUnique = async function(root, params, ctx, options) {
	return database.user.checkUnique(ctx.user, params.parameter, params.value);
}

const listAll = async function(root, params, ctx, options) {
	return database.user.listAll(ctx.user, params.skip, params.limit);
}

const checkUserPermission = async function(root, params, ctx, options) {
	return database.user.checkUserPermission(ctx.user, params.username, params.permission);
}

const addPermission = async function(root, params, ctx, options) {
	return database.user.addPermission(ctx.user, params.username, params.permission);
}

const removePermission = async function(root, params, ctx, options) {
	return database.user.removePermission(ctx.user, params.username, params.permission);
}

const addRole = async function(root, params, ctx, options) {
	return database.user.addRole(ctx.user, params.username, params.role);
}

const removeRole = async function(root, params, ctx, options) {
	return database.user.removeRole(ctx.user, params.username, params.role);
}

const registerUser = async function(root, params, ctx, options) {
	return database.user.registerUser(ctx.user, {
		firstname: params.firstname, 
		lastname: params.lastname,
		username: params.username,
		studentID: params.studentID, 
		university: params.university, 
		email: params.email, 
		mobileNumber: params.mobileNumber, 
		password: params.password, 
		confirmPassword: params.confirmPassword, 
		PTProficiency: params.PTProficiency, 
		hasSmartphone: params.hasSmartphone, 
		friends: params.friends
	});
}

// Get this user's actions
const getUserActions = async function(root, params, ctx, options) {
	return database.user.getUserActions(ctx.user, params.action, params.skip, params.limit);
}

// Get actions
const getActions = async function(root, params, ctx, options) {
	return database.user.getActions(ctx.user, params.username, params.action, params.skip, params.limit);
}

const setUserEnabled = async function(root, params, ctx, options) {
	return database.user.setUserEnabled(ctx.user, params.username, params.enabled);
}

const setUserPaidAmount = async function(root, params, ctx, options) {
	return database.user.setUserPaidAmount(ctx.user, params.username, params.amount);
}

const getUsersByTeam = async function(root, params, ctx, options) {
	return database.user.getUsersByTeam(ctx.user, params.teamId);
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
	setUserPaidAmount,
	getUsersByTeam
};
