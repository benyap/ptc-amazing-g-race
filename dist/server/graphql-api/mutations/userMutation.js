'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var _types = require('../types');

var _types2 = _interopRequireDefault(_types);

var _resolvers = require('../resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addPermission = {
	type: _types2.default.confirmType,
	description: 'Add a permission to a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the permission to',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		permission: {
			name: 'permission',
			description: 'The permission to add',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.addPermission(root, params, ctx, options);
	}
};

var removePermission = {
	type: _types2.default.confirmType,
	description: 'Remove a permission from a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the permission to',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		permission: {
			name: 'permission',
			description: 'The permission to remove',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.removePermission(root, params, ctx, options);
	}
};

var addRole = {
	type: _types2.default.confirmType,
	description: 'Add a role to a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the role to',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		role: {
			name: 'role',
			description: 'The role to add',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.addRole(root, params, ctx, options);
	}
};

var removeRole = {
	type: _types2.default.confirmType,
	description: 'Remove a role from a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to add the role to',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		role: {
			name: 'role',
			description: 'The role to remove',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.removeRole(root, params, ctx, options);
	}
};

var registerUser = {
	type: _types2.default.userType,
	description: 'Register a new user',
	args: {
		firstname: {
			name: 'firstname',
			description: 'The user\'s first name',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		lastname: {
			name: 'lastname',
			description: 'The user\'s last name',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		username: {
			name: 'username',
			description: 'The user\'s username',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		email: {
			name: 'email',
			description: 'The user\'s email',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		mobileNumber: {
			name: 'mobileNumber',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The user\'s mobile number'
		},
		studentID: {
			name: 'studentID',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The user\'s student ID'
		},
		university: {
			name: 'university',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The university the user attends'
		},
		password: {
			name: 'password',
			description: 'The user\'s password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		confirmPassword: {
			name: 'confirmPassword',
			description: 'The user\'s password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		publicTransport: {
			name: 'publicTransport',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt),
			description: 'How confident are you in taking public transport and using maps?'
		},
		smartphone: {
			name: 'smartphone',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'Do you have a smartphone that you can use on the day?'
		},
		friends: {
			name: 'friends',
			type: _graphql.GraphQLString,
			description: 'List two other people you want on your team'
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.registerUser(root, params, ctx, options);
	}
};

var setUserEnabled = {
	type: _types2.default.confirmType,
	description: 'Set the enabled status of a user',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to set the status of',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		enabled: {
			name: 'enabled',
			description: 'True to enabled the user, false to disable the user',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.setUserEnabled(root, params, ctx, options);
	}
};

var setUserPaidAmount = {
	type: _types2.default.confirmType,
	description: 'Set the amount the user has paid',
	args: {
		username: {
			name: 'username',
			description: 'The username of the user to set the status of',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		amount: {
			name: 'amount',
			description: 'The amount the user has paid',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.setUserPaidAmount(root, params, ctx, options);
	}
};

exports.default = {
	addPermission: addPermission,
	removePermission: removePermission,
	addRole: addRole,
	removeRole: removeRole,
	registerUser: registerUser,
	setUserEnabled: setUserEnabled,
	setUserPaidAmount: setUserPaidAmount
};