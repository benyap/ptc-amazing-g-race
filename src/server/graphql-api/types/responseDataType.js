import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const responseDataType = new GraphQLObjectType({
	name: 'ResponseData',
	description: 'The data in a challenge item response',
	fields: {
		date: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the data was retrieved'
		},
		data: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The response data'
		}
	}
});


export default responseDataType;
