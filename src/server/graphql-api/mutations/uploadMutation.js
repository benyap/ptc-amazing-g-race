import {
	GraphQLID,
	GraphQLString,
	GraphQLFloat,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const _uploadObject = {
	type: types.confirmType,
	description: 'Upload an object to S3',
	args: {
		collection: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The collection the object upload belongs to'
		},
		key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A unique identifier for the object'
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.uploadResolver._uploadObject(root, params, ctx, options);
	}
}


const _deleteObject = {
	type: types.confirmType,
	description: 'Delete an object from S3',
	args: {
		collection: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The collection the object upload belongs to'
		},
		key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A unique identifier for the object'
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.uploadResolver._deleteObject(root, params, ctx, options);
	}
}


export default {
	_uploadObject,
	_deleteObject
};
