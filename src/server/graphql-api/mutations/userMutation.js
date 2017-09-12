import {
	GraphQLString,
	GraphQLID,
	GraphQLInt,
	GraphQLFloat,
	GraphQLBoolean,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const addPermission = {
	type: types.confirmType,
	description: 'Add a permission to a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the permission to',
			type: new GraphQLNonNull(GraphQLString)
		},
		permission: {
			name: 'permission',
			description: 'The permission to add',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.addPermission(root, params, ctx, options);
	}
}


const removePermission = {
	type: types.confirmType,
	description: 'Remove a permission from a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the permission to',
			type: new GraphQLNonNull(GraphQLString)
		},
		permission: {
			name: 'permission',
			description: 'The permission to remove', 
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.removePermission(root, params, ctx, options);
	}
}


const addRole = {
	type: types.confirmType,
	description: 'Add a role to a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the role to',
			type: new GraphQLNonNull(GraphQLString)
		},
		role: {
			name: 'role',
			description: 'The role to add',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.addRole(root, params, ctx, options);
	}
}


const removeRole = {
	type: types.confirmType,
	description: 'Remove a role from a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the role to',
			type: new GraphQLNonNull(GraphQLString)
		},
		role: {
			name: 'role',
			description: 'The role to remove',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.removeRole(root, params, ctx, options);
	}
}


const registerUser = {
	type: types.userType,
	description: 'Register a new user',
	args: {
		firstname: {
			name: 'firstname',
			description: 'The user\'s first name',
			type: new GraphQLNonNull(GraphQLString)
		},
		lastname: {
			name: 'lastname',
			description: 'The user\'s last name',
			type: new GraphQLNonNull(GraphQLString)
		},
		username: {
			name: 'username',
			description: 'The user\'s username',
			type: new GraphQLNonNull(GraphQLString)
		},
		email: {
			name: 'email',
			description: 'The user\'s email',
			type: new GraphQLNonNull(GraphQLString)
		},
		mobileNumber: {
			name: 'mobileNumber',
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user\'s mobile number'
		},
		studentID: {
			name: 'studentID',
			type: new GraphQLNonNull(GraphQLString),
			description: 'The user\'s student ID'
		},
		university: {
			name: 'university',
			type: new GraphQLNonNull(GraphQLString),
			description: 'The university the user attends',
		},
		password: {
			name: 'password',
			description: 'The user\'s password',
			type: new GraphQLNonNull(GraphQLString)
		},
		confirmPassword: {
			name: 'confirmPassword',
			description: 'The user\'s password',
			type: new GraphQLNonNull(GraphQLString)
		},
		PTProficiency: {
			name: 'PTProficiency',
			type: new GraphQLNonNull(GraphQLInt),
			description: 'How confident are you in taking public transport and using maps?'
		},
		hasSmartphone: {
			name: 'hasSmartphone',
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'Do you have a smartphone with data that you can use on the day?',
		},
		friends: {
			name: 'friends',
			type: GraphQLString,
			description: 'List one or two friends that you want on your team'
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.registerUser(root, params, ctx, options);
	}
}


const setUserEnabled = {
	type: types.confirmType,
	description: 'Set the enabled status of a user',
	args: {
		username: {
			name: 'username', 
			description: 'The username of the user to set the status of',
			type: new GraphQLNonNull(GraphQLString)
		},
		enabled: {
			name: 'enabled',
			description: 'True to enabled the user, false to disable the user',
			type: new GraphQLNonNull(GraphQLBoolean)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.setUserEnabled(root, params, ctx, options);
	}
}


const setUserPaidAmount = {
	type: types.confirmType,
	description: 'Set the amount the user has paid',
	args: {
		username: {
			name: 'username', 
			description: 'The username of the user to set the status of',
			type: new GraphQLNonNull(GraphQLString)
		},
		amount: {
			name: 'amount',
			description: 'The amount the user has paid',
			type: new GraphQLNonNull(GraphQLFloat)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.userResolver.setUserPaidAmount(root, params, ctx, options);
	}
}


export default {
	addPermission,
	removePermission,
	addRole,
	removeRole,
	registerUser,
	setUserEnabled,
	setUserPaidAmount
};
