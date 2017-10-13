import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
	GraphQLEnumType,
	GraphQLList
} from 'graphql';


const challengeItemType = new GraphQLObjectType({
	name: 'ChallengeItem',
	description: 'Contains information about a challenge that can be completed by participants',
	fields: {
		key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A unique identifier for the challenge item'			
		},
		order: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'A number used to order how the challenge items are displayed'
		},
		type: {
			type: new GraphQLNonNull(new GraphQLEnumType({
				name: 'ChallengeType',
				values: {
					upload: { value: 'upload' },
					phrase: { value: 'phrase' },
				}
			})),
			description: 'The challenge type'
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A title for the challenge item'
		},
		description: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A description for the challenge item'
		}
	}
});


export default challengeItemType;
