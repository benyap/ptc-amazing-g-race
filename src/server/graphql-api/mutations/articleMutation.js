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


const removeArticle = {
	type: types.confirmType,
	description: 'Remove an article',
	args: {
		articleId: {
			name: 'articleId',
			description: 'The id of the article',
			type: new GraphQLNonNull(GraphQLID)
		},
		category: {
			name: 'category',
			description: 'The category of the article',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.articleResolver.removeArticle(root, params, ctx, options);
	}
};


const setArticleTitle = {
	type: types.confirmType,
	description: 'Set the title of an article',
	args: {
		articleId: {
			name: 'articleId',
			description: 'The id of the article',
			type: new GraphQLNonNull(GraphQLID)
		},
		category: {
			name: 'category',
			description: 'The category of the article',
			type: new GraphQLNonNull(GraphQLString)
		},
		newTitle: {
			name: 'content',
			description: 'The new title of the article',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.articleResolver.setArticleTitle(root, params, ctx, options);
	}
};


const editArticle = {
	type: types.confirmType,
	description: 'Edit an article',
	args: {
		articleId: {
			name: 'articleId',
			description: 'The id of the article',
			type: new GraphQLNonNull(GraphQLID)
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
		return resolvers.articleResolver.editArticle(root, params, ctx, options);
	}
};


export default {
	addArticle,
	removeArticle,
	setArticleTitle,
	editArticle
};
