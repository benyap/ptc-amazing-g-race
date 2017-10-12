import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getResponse = {
	type: types.responseType,
	description: 'Get a response for a challenge by id',
	args: {
		responseId: {
			name: 'responseId',
			description: 'The response id',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.responseResolver.getResponse(root, params, ctx, options);
	}
};


const getResponseData = {
	type: types.responseDataType,
	description: 'Gets the data from a response (admin only)',
	args: {
		responseId: {
			name: 'responseId',
			description: 'The response id',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.responseResolver.getResponseData(root, params, ctx, options);
	}
};


const getResponses = {
	type: new GraphQLList(types.responseType),
	description: 'Get responses for a challenge',
	args: {
		challengeKey: {
			name: 'challengeKey',
			description: 'The challenge key',
			type: GraphQLString
		},
		itemKey: {
			name: 'itemKey',
			description: 'The challenge item key (optional)',
			type: GraphQLString
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.responseResolver.getResponses(root, params, ctx, options);
	}
};


const getTeamResponses = {
	type: new GraphQLList(types.responseType),
	description: 'Get a user\'s team\'s responses for a challenge item',
	args: {
		challengeKey: {
			name: 'challengeKey',
			description: 'The challenge key',
			type: new GraphQLNonNull(GraphQLString)
		},
		itemKey: {
			name: 'itemKey',
			description: 'The challenge item key',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.responseResolver.getTeamResponses(root, params, ctx, options);
	}
};


export default {
	getResponse,
	getResponseData,
	getResponses,
	getTeamResponses
};
