import {
	GraphQLString,
	GraphQLID,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const createArticle = {
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
		src: {
			name: 'src',
			description: 'The markdown source of the article',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.articleResolver.createArticle(root, params, ctx, options);
	}
};


export default {
	createArticle
};
