import database from '../../db';


const getTeam = async function(root, params, ctx, options) {
	return database.team.getTeam(ctx.user, params.teamId);
}

const getTeams = async function(root, params, ctx, options) {
	return database.team.getTeams(ctx.user, params.skip, params.limit);
}

const addTeam = async function(root, params, ctx, options) {
	return database.team.addTeam(ctx.user, params.teamName);
}

const removeTeam = async function(root, params, ctx, options) {
	return database.team.removeTeam(ctx.user, params.teamName);
}


export default {
	getTeam,
	getTeams,
	addTeam,
	removeTeam
};
