import {
	GraphQLString,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLID
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const addResponse = {
	type: types.confirmType,
	description: 'Add a response to a challenge item',
	args: {
		challengeKey: {
			name: 'challengeKey',
			description: 'The key of the challenge the response is for',
			type: new GraphQLNonNull(GraphQLString)
		},
		itemKey: {
			name: 'itemKey',
			description: 'The key of the challenge item the response is for',
			type: new GraphQLNonNull(GraphQLString)
		},
		responseType: {
			name: 'responseType',
			description: 'The type of response',
			type: new GraphQLNonNull(GraphQLString)
		},
		responseValue: {
			name: 'responseValue',
			description: 'The value of response',
			type: GraphQLString
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.responseResolver.addResponse(root, params, ctx, options);
	}
};


export default {
	addResponse,
	// removeResponse,
	// checkResponse
};
