import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getStories = {
	type: new GraphQLList(types.storyType),
	description: 'Get stories',
	args: {
		storyType: {
			name: 'storyType',
			description: 'Restrict the stories to get by story type',
			type: types.storyTypeType
		},
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
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.getStories(root, params, ctx, options);
	}
};


const getAllStories = {
	type: new GraphQLList(types.storyType),
	description: 'Get published and unpublised stories (admins only)',
	args: {
		storyType: {
			name: 'storyType',
			description: 'Restrict the stories to get by story type',
			type: types.storyTypeType
		},
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
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.getAllStories(root, params, ctx, options);
	}
};


export default {
	getStories,
	getAllStories
};
