import {
	GraphQLString,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLFloat,
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


const checkResponse = {
	type: types.confirmType,
	description: 'Add a response to a challenge item',
	args: {
		responseId: {
			name: 'responseId',
			description: 'The type of response',
			type: new GraphQLNonNull(GraphQLID)
		},
		responseValid: {
			name: 'responseValid',
			description: 'Whether the response was valid or not',
			type: new GraphQLNonNull(GraphQLBoolean)
		},
		retry: {
			name: 'retry',
			description: 'Whether the team is allowed to retry the challenge item or not',
			type: new GraphQLNonNull(GraphQLBoolean)
		},
		pointsAwarded: {
			name: 'pointsAwarded',
			description: 'The number of points the response should add to the team',
			type: new GraphQLNonNull(GraphQLFloat)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.responseResolver.checkResponse(root, params, ctx, options);
	}
};


export default {
	addResponse,
	// removeResponse,
	checkResponse
};
