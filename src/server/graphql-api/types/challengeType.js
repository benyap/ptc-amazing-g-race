import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';

import ChallengeItem from './challengeItemType';


const challengeType = new GraphQLObjectType({
	name: 'Challenge',
	description: 'Contains information about a group of challenge items.',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		key: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A unique identifier for the challenge'
		},
		order: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'A number used to order how the challenges are displayed'
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
		notes: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'Notes about the challenge (not viewable by the public)'
		},
		locked: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the challenge is locked'
		},
		items: {
			type: new GraphQLNonNull(new GraphQLList(ChallengeItem)),
			description: 'A list of challenge items the participants can complete'
		},
		teams: {
			type: new GraphQLNonNull(new GraphQLList(GraphQLID)),
			description: 'List of teamIds that have access to this challenge'
		}
	}
});


export default challengeType;
