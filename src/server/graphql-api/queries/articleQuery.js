import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getArticles = {
	type: new GraphQLNonNull(new GraphQLList(types.articleType)),
	description: 'Get the articles from a category',
	args: {
		category: {
			name: 'category',
			description: 'The category to find articles from',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.articleResolver.getArticles(root, params, ctx, options);
	}
};

const getArticle = { 
	type: new GraphQLNonNull(types.articleType),
	description: 'Get an article from a category',
	args: {
		category: {
			name: 'category',
			description: 'The category to find articles from',
			type: new GraphQLNonNull(GraphQLString)
		},
		articleId: {
			name: 'articleId',
			description: 'The id of the article',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.articleResolver.getArticle(root, params, ctx, options);
	}

}


export default {
	getArticles,
	getArticle
};
