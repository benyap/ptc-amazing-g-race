import database from '../../db';


// Get challenge responses
const getResponses = function(root, params, ctx, options) {
	return database.response.getResponses(ctx.user, params.challengeKey, params.itemKey);
}


// Add a challenge response
const addResponse = function(root, params, ctx, options) {
	return database.response.addResponse(ctx.user, params.challengeKey, params.itemKey, 
		params.responseType, params.responseValue, ctx.files ? ctx.files.file : null);
}


export default {
	getResponses,
	addResponse
};
