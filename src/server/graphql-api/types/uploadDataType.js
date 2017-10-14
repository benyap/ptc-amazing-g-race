import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const uploadDataType = new GraphQLObjectType({
	name: 'UploadData',
	description: 'The data contained in an upload',
	fields: {
		date: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the data was retrieved'
		},
		data: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The upload data'
		}
	}
});


export default uploadDataType;
