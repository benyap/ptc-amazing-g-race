import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getTeam = {
	type: types.teamType,
	description: 'Get a team',
	args: {
		teamId: {
			name: 'teamId',
			description: 'The id of the team',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.getTeam(root, params, ctx, options);
	}
};

const getTeams = {
	type: new GraphQLList(types.teamType),
	args: {
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: GraphQLInt
		}
	},
	description: 'Get the list of teams',
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.getTeams(root, params, ctx, options);
	}
}


export default {
	getTeam,
	getTeams
};
