import database from '../../db';


// Create a challenge
const createChallenge = function(root, params, ctx, options) {
	return database.challenge.createChallenge(ctx.user, params.key, params.order, 
		params.passphrase, params.title, params.description);
}

// Delete a challenge
const deleteChallenge = function(root, params, ctx, options) {
	return database.challenge.deleteChallenge(ctx.user, params.key);
}

// Edit a challenge's property
const _editChallengeProperty = function(root, params, ctx, options) {
	return database.challenge._editChallengeProperty(ctx.user, params.key, params.property, params.value);
}

// Get all challenges
const getAllChallenges = function(root, params, ctx, options) {
	return database.challenge.getAllChallenges(ctx.user);
}

// Get challenges
const getChallenges = function(root, params, ctx, options) {
	return database.challenge.getChallenges(ctx.user);
}

// Get challenge
const getChallenge = function(root, params, ctx, options) {
	return database.challenge.getChallenge(ctx.user, params.key);
}

// Get challenge by Id
const getChallengeById = function(root, params, ctx, options) {
	return database.challenge.getChallengeById(ctx.user, params.id);
}

// Add a team to the list of unlocked teams
const addTeamToUnlocked = function(root, params, ctx, options) {
	return database.challenge.addTeamToUnlocked(ctx.user, params.key, params.teamId);
}

// Remove a team from the list of unlocked teams
const removeTeamFromUnlocked = function(root, params, ctx, options) {
	return database.challenge.removeTeamFromUnlocked(ctx.user, params.key, params.teamId);
}


// Create a challenge
const createChallengeItem = function(root, params, ctx, options) {
	return database.challenge.createChallengeItem(ctx.user, params.key, params.itemKey, params.title, params.order, params.type);
}

// Delete a challenge
const deleteChallengeItem = function(root, params, ctx, options) {
	return database.challenge.deleteChallengeItem(ctx.user, params.key, params.itemKey);
}

// Edit a challenge's property
const _editChallengeItemProperty = function(root, params, ctx, options) {
	return database.challenge._editChallengeItemProperty(ctx.user, params.key, params.itemKey, params.property, params.value);
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
};
