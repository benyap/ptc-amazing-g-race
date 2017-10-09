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

// Add a team to the list of unlocked teams
const addTeamToUnlocked = function(root, params, ctx, options) {
	return database.challenge.addTeamToUnlocked(ctx.user, params.key, params.teamId);
}

// Remove a team from the list of unlocked teams
const removeTeamFromUnlocked = function(root, params, ctx, options) {
	return database.challenge.removeTeamFromUnlocked(ctx.user, params.key, params.teamId);
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
};
