import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLFloat,
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const locationType = new GraphQLObjectType({
	name: 'Location',
	description: 'A location',
	fields: {
		lastUpdateSuccess: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the last location update was successful'
		},
		lastUpdate: {
			type: GraphQLDateTime,
			description: 'The last time this location was updated'
		},
		lat: {
			type: GraphQLFloat,
			description: 'The latitude of the location'
		},
		long: {
			type: GraphQLFloat,
			description: 'The longitude of the location'
		}
	}
});


export default locationType;
