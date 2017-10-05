import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLEnumType,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getUserById = {
	type: types.userType,
	description: 'Retrieve a user by id',
	args: {
		userId: {
			name: 'userId',
			description: 'User\'s id',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getUserById(root, params, ctx, options);
	}
};

const getUserByUsername = {
	type: types.userType,
	description: 'Retrieve a user by username',
	args: {
		username: {
			name: 'username',
			description: 'User\'s username',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getUserByUsername(root, params, ctx, options);
	}
};

const getUserByEmail = {
	type: types.userType,
	description: 'Retrieve a user by email',
	args: {
		email: {
			name: 'email',
			description: 'User\'s email',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getUserByEmail(root, params, ctx, options);
	}
};

const getMe = {
	type: types.userType,
	description: 'Retrieve the current user',
	args: {},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getMe(root, params, ctx, options);
	}
};

const checkUnique = {
	type: types.confirmType,
	description: 'Check if a user parameter is unique in the database',
	args: {
		parameter: {
			name: 'parameter',
			description: 'The parameter to check',
			type: new GraphQLNonNull(new GraphQLEnumType({
				name: 'UserParameter',
				description: 'A user paramter that can be checked for uniqueness',
				values: {
					email: { value: 'email' },
					username: { value: 'username' }
				}
			}))
		},
		value: {
			name: 'value',
			description: 'The value to check',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.checkUnique(root, params, ctx, options);
	}
};

const getUsers = {
	type: new GraphQLList(types.userType),
	description: 'Retrieve a list of all users',
	args: {
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: GraphQLInt
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getUsers(root, params, ctx, options);
	}
}


const checkUserPermission = {
	type: types.permissionCheckType,
	description: 'Verify if a user has a specified permission',
	args: {
		permission: {
			name: 'permission',
			description: 'The permission to check for',
			type: new GraphQLNonNull(GraphQLString)
		},
		username: {
			name: 'username',
			description: 'The user to check for the permission',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.checkUserPermission(root, params, ctx, options);
	}
}


const getUserActions = {
	type: new GraphQLList(types.actionType),
	description: 'Get user actions',
	args: {
		action: {
			name: 'action',
			description: 'Specify a specific action to find',
			type: GraphQLString
		},
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: GraphQLInt
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getUserActions(root, params, ctx, options);
	}
}


const getActions = {
	type: new GraphQLList(types.actionType),
	description: 'Get actions',
	args: {
		username: {
			name: 'username',
			description: 'Specify a user to find actions for',
			type: GraphQLString
		},
		action: {
			name: 'action',
			description: 'Specify a specific action to find',
			type: GraphQLString
		},
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: GraphQLInt
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.getActions(root, params, ctx, options);
	}
}


export default {
	getUserById,
	getUserByUsername,
	getUserByEmail,
	getMe,
	checkUnique,
	getUsers,
	checkUserPermission,
	getUserActions,
	getActions
};
