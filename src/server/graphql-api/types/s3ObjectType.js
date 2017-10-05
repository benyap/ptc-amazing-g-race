import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const s3ObjectType = new GraphQLObjectType({
	name: 'S3Object',
	description: 'An object retrieved from the AWS S3 API',
	fields: {
		Key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The object key'
		},
		LastModified: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the object was last modified'
		},
		Size: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'The size of the object in bytes'
		}
	}
});


export default s3ObjectType;
