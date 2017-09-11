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

var login = {
	type: _types2.default.authType,
	description: 'Provide login credentials for an access token',
	args: {
		email: {
			name: 'email',
			description: 'Email used to identify the user',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		password: {
			name: 'password',
			description: 'Account password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.authResolver.login(root, params, ctx, options);
	}
};

var adminLogin = {
	type: _types2.default.authType,
	description: 'Provide administrator login credentials for an access token',
	args: {
		email: {
			name: 'email',
			description: 'Email used to identify the user',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		password: {
			name: 'password',
			description: 'Account password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.authResolver.adminLogin(root, params, ctx, options);
	}
};

var refresh = {
	type: _types2.default.authType,
	description: 'Request a new access token with a valid refresh token. This will log the time the refresh token was used.',
	args: {
		refreshToken: {
			name: 'refreshToken',
			description: 'The refresh token for authentication',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.authResolver.refresh(root, params, ctx, options);
	}
};

var logout = {
	type: _types2.default.confirmType,
	description: 'Logout a user by revoking their refresh token (client responsibility to remove the access token)',
	args: {
		refreshToken: {
			name: 'refreshToken',
			description: 'The refresh token to revoke',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.authResolver.logout(root, params, ctx, options);
	}
};

var changePassword = {
	type: _types2.default.confirmType,
	description: 'Change a user\'s password',
	args: {
		currentPassword: {
			name: 'currentPassword',
			description: 'The user\'s current password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		newPassword: {
			name: 'newPassword',
			description: 'A new password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		confirmPassword: {
			name: 'confirmPassword',
			description: 'Confirm the new password',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.authResolver.changePassword(root, params, ctx, options);
	}
};

exports.default = {
	login: login,
	adminLogin: adminLogin,
	refresh: refresh,
	logout: logout,
	changePassword: changePassword
};