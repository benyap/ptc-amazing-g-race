import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLFloat,
	GraphQLList,
	GraphQLBoolean
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';

import locationType from './locationType';
import raceDetailsType from './raceDetailsType';


const userType = new GraphQLObjectType({
	name: 'User',
	description: 'A user',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		firstname: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'First name of the user'
		},
		lastname: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'Last name of the user'
		},
		username: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user\'s username'
		},
		studentID: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user\'s student ID'
		},
		university: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The university the user attends',
		},
		email: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'Email of the user'
		},
		mobileNumber: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user\'s mobile number'
		},
		registerDate: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the user registered'
		},
		enabled: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the user is enabled (disabled users cannot log in)'
		},
		isAdmin: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the user is has access to the admin backend'
		},
		paidAmount: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'The amount the user has paid'
		},
		raceDetails: {
			type: new GraphQLNonNull(raceDetailsType),
			description: 'The user\'s race details'
		},
		roles: {
			type: new GraphQLList(GraphQLString),
			description: 'List of roles assigned to the user'
		},
		permissions: {
			type: new GraphQLList(GraphQLString),
			description: 'List of permissions assigned to the user'
		},
		teamId: {
			type: GraphQLID,
			description: 'The id of the team the user has been assigned to'
		},
		location: {
			type: locationType,
			description: 'The location of a user'
		}
	}
});


export default userType;
