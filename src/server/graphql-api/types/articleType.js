import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';

import resolvers from '../resolvers';
import userType from './userType';


const articleType = new GraphQLObjectType({
	name: 'Article',
	description: 'An article written in markdown',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The title of the article'
		},
		category: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The category the article belongs to'
		},
		content: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The markdown content of the article'
		},
		created: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the article was created'
		},
		createdBy: {
			type: userType,
			description: 'The user that created the article',
			resolve(root, params, ctx, options) {
				params.username = root.createdBy;
				return resolvers.userResolver.getUserByUsername(root, params, ctx, options);
			}
		},
		modified: {
			type: GraphQLDateTime,
			description: 'The date the article was last modified'
		},
		modifiedBy: {
			type: userType,
			description: 'The user that last modified the article',
			resolve(root, params, ctx, options) {
				if (root.modifiedBy) {
					params.username = root.modifiedBy;
					return resolvers.userResolver.getUserByUsername(root, params, ctx, options);
				}
			}
		}
	}
});


export default articleType;
