import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getResponses = {
	type: new GraphQLList(types.responseType),
	description: 'Get responses for a challenge',
	args: {
		challengeKey: {
			name: 'challengeKey',
			description: 'The challenge key',
			type: new GraphQLNonNull(GraphQLString)
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


export default {
	getResponses
};
