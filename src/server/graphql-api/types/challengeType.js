import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';


const challengeType = new GraphQLObjectType({
	name: 'Challenge',
	description: 'Contains information about a challenge that can be completed by participants',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A unique identifier for the challenge'
		},
		group: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The group the challenge belongs to'
		},
		type: {
			type: new GraphQLNonNull(GraphQLString), // TODO: Make this an enum
			description: 'The type of input required to complete the challenge'
		},
		public: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the challenge should be publicly available'
		},
		passphrase: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The passphrase required to unlock the challenge'
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A title for the challenge'
		},
		description: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A description for the challenge'
		},
		locked: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the challenge is locked'
		},
		teams: {
			type: new GraphQLNonNull(new GraphQLList(GraphQLID)),
			description: 'List of teamIds that have access to this challenge'
		}
	}
});


export default challengeType;
