import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLBoolean
} from 'graphql';

import s3ObjectType from './s3ObjectType';


const s3ObjectListType = new GraphQLObjectType({
	name: 'S3ObjectList',
	description: 'A list of objects retrieved from the AWS S3 API',
	fields: {
		Contents: {
			type: new GraphQLNonNull(new GraphQLList(s3ObjectType)),
			description: 'List of objects that match the given prefix'
		},
		CommonPrefixes: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLObjectType({
				name: 'S3ObjectPrefix',
				description: 'A prefix that is shared by a group of objects',
				fields: {
					Prefix: {
						type: new GraphQLNonNull(GraphQLString),
						description: 'The common prefix'
					}
				}
			}))),
			description: 'List of objects that share the same prefix'
		},
		Name: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The name of the bucket'
		},
		Prefix: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The prefix applied in the query'
		},
		KeyCount: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'The number of objects returned'
		},
		IsTruncated: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the results were truncated'
		}
	}
});


export default s3ObjectListType;
