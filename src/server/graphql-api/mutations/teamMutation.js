import {
	GraphQLID,
	GraphQLString,
	GraphQLFloat,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const addTeam = {
	type: types.confirmType,
	description: 'Add a new team',
	args: {
		teamName: {
			name: 'teanName',
			description: 'The name of the team',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.addTeam(root, params, ctx, options);
	}
}


const removeTeam = {
	type: types.confirmType,
	description: 'Remove an existing team',
	args: {
		teamId: {
			name: 'teamId',
			description: 'The id of the team',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.removeTeam(root, params, ctx, options);
	}
}

const setTeamName = {
	type: types.confirmType,
	description: 'Set the name for a team',
	args: {
		teamId: {
			name: 'teamId',
			description: 'The id of the team',
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			name: 'name',
			description: 'The new name for the team',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.setTeamName(root, params, ctx, options);
	}
}

const setTeamPoints = {
	type: types.confirmType,
	description: 'Set the points for a team',
	args: {
		teamId: {
			name: 'teamId',
			description: 'The id of the team',
			type: new GraphQLNonNull(GraphQLID)
		},
		points: {
			name: 'points',
			description: 'The points to set the team to',
			type: new GraphQLNonNull(GraphQLFloat)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.setTeamPoints(root, params, ctx, options);
	}
}


export default {
	addTeam,
	removeTeam,
	setTeamName,
	setTeamPoints
};
