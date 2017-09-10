import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const actionType = new GraphQLObjectType({
	name: 'Action',
	description: 'An action keeps track of something a user has done to mutate the database',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		action: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The action taken'
		},
		targetCollection: {
			type: GraphQLString,
			description: 'The collection to which the target belongs'
		},
		target: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The target of the action. This could be a username or an object Id.'
		},
		who: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The username of the user who executed this action'
		},
		date: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the action was executed'
		},
		infoJSONString: {
			type: GraphQLString,
			description: 'A string representation of a JSON object with more information about the action'
		}
	}
});


export default actionType;
