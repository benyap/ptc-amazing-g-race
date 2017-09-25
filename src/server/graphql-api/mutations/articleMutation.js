import {
	GraphQLString,
	GraphQLID,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const addArticle = {
	type: types.articleType,
	description: 'Create an article',
	args: {
		title: {
			name: 'title',
			description: 'The title of the article',
			type: new GraphQLNonNull(GraphQLString)
		},
		category: {
			name: 'category',
			description: 'The category of the article',
			type: new GraphQLNonNull(GraphQLString)
		},
		content: {
			name: 'content',
			description: 'The markdown content of the article',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.articleResolver.addArticle(root, params, ctx, options);
	}
};


export default {
	addArticle
};
