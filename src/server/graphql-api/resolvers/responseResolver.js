import database from '../../db';


// Get a challenge response
const getResponse = function(root, params, ctx, options) {
	return database.response.getResponse(ctx.user, params.responseId);
}

// Get a challenge response's data
const getResponseData = function(root, params, ctx, options) {
	return database.response.getResponseData(ctx.user, params.responseId);
}

// Get challenge responses
const getResponses = function(root, params, ctx, options) {
	return database.response.getResponses(ctx.user, params.challengeKey, params.itemKey);
}

// Get user's team's responses for a challenge item
const getTeamResponses = function(root, params, ctx, options) {
	return database.response.getTeamResponses(ctx.user, params.challengeKey, params.itemKey);
}

// Add a challenge response
const addResponse = function(root, params, ctx, options) {
	return database.response.addResponse(ctx.user, params.challengeKey, params.itemKey, 
		params.responseType, params.responseValue, ctx.files ? ctx.files.file : null);
}

// Check a challenge response
const checkResponse = function(root, params, ctx, options) {
	return database.response.checkResponse(ctx.user, params.responseId, params.responseValid, params.retry, params.pointsAwarded);
}


export default {
	getResponse,
	getResponseData,
	getResponses,
	getTeamResponses,
	addResponse,
	checkResponse
};
