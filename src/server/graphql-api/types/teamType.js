import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLFloat,
	GraphQLList,
	GraphQLInt
} from 'graphql';

import userType from './userType';
import resolvers from '../resolvers';


const teamType = new GraphQLObjectType({
	name: 'Team',
	description: 'A team in the competition',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID),
			description: 'Team ID'
		},
		teamName: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The name of the team'
		},
		points: {
			type: new GraphQLNonNull(GraphQLFloat),
			description: 'The number of points the team owns'
		},
		members: {
			type: new GraphQLNonNull(new GraphQLList(userType)),
			description: 'The list of team members',
			resolve(root, params, ctx, options) {
				return resolvers.userResolver.getUsersByTeam(root, {teamId: root._id}, ctx, options);
			}
		},
		memberCount: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'The number of members in the team',
			async resolve(root, params, ctx, options) {
				const users = await resolvers.userResolver.getUsersByTeam(root, {teamId: root._id}, ctx, options);
				return users.length;
			}
		}
	}
});


export default teamType;
