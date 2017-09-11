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

var getUserById = {
	type: _types2.default.userType,
	description: 'Retrieve a user by id',
	args: {
		userId: {
			name: 'userId',
			description: 'User\'s id',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.getUserById(root, params, ctx, options);
	}
};

var getUserByUsername = {
	type: _types2.default.userType,
	description: 'Retrieve a user by username',
	args: {
		username: {
			name: 'username',
			description: 'User\'s username',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.getUserByUsername(root, params, ctx, options);
	}
};

var getUserByEmail = {
	type: _types2.default.userType,
	description: 'Retrieve a user by email',
	args: {
		email: {
			name: 'email',
			description: 'User\'s email',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.getUserByEmail(root, params, ctx, options);
	}
};

var getMe = {
	type: _types2.default.userType,
	description: 'Retrieve the current user',
	args: {},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.getMe(root, params, ctx, options);
	}
};

var checkUnique = {
	type: _types2.default.confirmType,
	description: 'Check if a user parameter is unique in the database',
	args: {
		parameter: {
			name: 'parameter',
			description: 'The parameter to check',
			type: new _graphql.GraphQLNonNull(new _graphql.GraphQLEnumType({
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
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.checkUnique(root, params, ctx, options);
	}
};

var listAll = {
	type: new _graphql.GraphQLList(_types2.default.userType),
	description: 'Retrieve a list of all users',
	args: {
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: _graphql.GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: _graphql.GraphQLInt
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.listAll(root, params, ctx, options);
	}
};

var checkUserPermission = {
	type: _types2.default.permissionCheckType,
	description: 'Verify if a user has a specified permission',
	args: {
		permission: {
			name: 'permission',
			description: 'The permission to check for',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		username: {
			name: 'username',
			description: 'The user to check for the permission',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.checkUserPermission(root, params, ctx, options);
	}
};

var getUserActions = {
	type: new _graphql.GraphQLList(_types2.default.actionType),
	description: 'Get user actions',
	args: {
		action: {
			name: 'action',
			description: 'Specify a specific action to find',
			type: _graphql.GraphQLString
		},
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: _graphql.GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: _graphql.GraphQLInt
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.getUserActions(root, params, ctx, options);
	}
};

var getActions = {
	type: new _graphql.GraphQLList(_types2.default.actionType),
	description: 'Get actions',
	args: {
		username: {
			name: 'username',
			description: 'Specify a user to find actions for',
			type: _graphql.GraphQLString
		},
		action: {
			name: 'action',
			description: 'Specify a specific action to find',
			type: _graphql.GraphQLString
		},
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: _graphql.GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: _graphql.GraphQLInt
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.userResolver.getActions(root, params, ctx, options);
	}
};

exports.default = {
	getUserById: getUserById,
	getUserByUsername: getUserByUsername,
	getUserByEmail: getUserByEmail,
	getMe: getMe,
	checkUnique: checkUnique,
	listAll: listAll,
	checkUserPermission: checkUserPermission,
	getUserActions: getUserActions,
	getActions: getActions
};