import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean
} from 'graphql';


const raceDetailsType = new GraphQLObjectType({
	name: 'RaceDetails',
	description: 'A user\'s race details',
	fields: {
		PTProficiency: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'How confident are you in taking public transport and using maps?'
		},
		hasSmartphone: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'Do you have a smartphone that you can use on the day?',
		},
		friends: {
			type: GraphQLString,
			description: 'List two other people you want on your team'
		}
	}
});


export default raceDetailsType;
