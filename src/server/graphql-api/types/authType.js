import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';


const authType = new GraphQLObjectType({
	name: 'Authentication',
	description: 'Holds identifiers and tokens to allow a user access upon successful authentication',
	fields: {
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if authentication was succesful'
		},
		message: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'A message regarding the login state'
		},
		username: {
			type: GraphQLString,
			description: 'The username of the user'
		},
		email: {
			type: GraphQLString,
			description: 'The email of the user'
		},
		userId: {
			type: GraphQLID,
			description: 'Id of the user'
		},
		access_token: {
			type: GraphQLString,
			description: 'A JWT token that grants access for a short amount of time'
		},
		refresh_token: {
			type: GraphQLString,
			description: 'A JWT token that allows the user to request a new access token (keep this secure)'
		}
	}
});


export default authType;
