import {
	GraphQLString,
	GraphQLNonNull,
	GraphQLInt
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const _listObjectsFromS3 = {
	type: types.s3ObjectListType,
	description: 'List uploaded objects from AWS S3',
	args: {
		MaxKeys: {
			name: 'MaxKeys',
			description: 'The maximum number of keys to return',
			type: GraphQLInt
		},
		Prefix: {
			name: 'Prefix',
			description: 'Limits the response to keys that begin with the specified prefix',
			type: GraphQLString
		},
		StartAfter: {
			name: 'StartAfter',
			description: 'The key of an object after which the listing should begin',
			type: GraphQLString
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.uploadResolver._listObjectsFromS3(root, params, ctx, options);
	}
};


const _getObject = {
	type: types.uploadDataType,
	description: 'Get the data from an uploaded object',
	args: {
		key: {
			name: 'key',
			description: 'The full key of the object (including the collection)',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.uploadResolver._getObject(root, params, ctx, options);
	}
}


export default {
	_listObjectsFromS3,
	_getObject
};
