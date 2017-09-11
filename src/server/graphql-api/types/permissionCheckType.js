import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLString
} from 'graphql';


const permissionCheckType = new GraphQLObjectType({
	name: 'PermissionCheckResult',
	description: 'Result of a permission check',
	fields: {
		username: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The username of the user being checked'
		},
		permission: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The permission being checked for'
		},
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the user has the permission'
		}
	}
});


export default permissionCheckType;
