import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLEnumType,
	GraphQLBoolean
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';


const responseType = new GraphQLObjectType({
	name: 'Response',
	description: 'A team\'s response to a challenge item',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		challengeKey: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The key of the challenge the response is for'
		},
		itemKey: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The key of the challenge item the response is for'
		},
		teamId: {
			type: new GraphQLNonNull(GraphQLID),
			description: 'The id of the team the response is from'
		},
		uploadDate: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date which the response was uplaoded'
		},
		uploadedBy: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user who uploaded the response'
		},
		checked: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the response has been checked by an admin'
		},
		responseValid: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the response has been checked and is valid'
		},
		retry: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the team is allowed to give another response once checked'
		},
		checkedBy: {
			type: GraphQLString,
			description: 'The user who checked the response'
		},
		pointsAwarded: {
			type: GraphQLInt,
			description: 'The number of points awarded to the team for the challenge'
		},
		responseType: {
			type: new GraphQLNonNull(new GraphQLEnumType({
				name: 'ResponseType',
				values: {
					upload: { value: 'upload' },
					phrase: { value: 'phrase' },
				}
			})),
			description: 'The response type'
		},
		responseValue: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The response value'
		}
	}
});


export default responseType;
