'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var authType = new _graphql.GraphQLObjectType({
	name: 'Authentication',
	description: 'Holds identifiers and tokens to allow a user access upon successful authentication',
	fields: {
		ok: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'True if authentication was succesful'
		},
		message: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'A message regarding the login state'
		},
		username: {
			type: _graphql.GraphQLString,
			description: 'The username of the user'
		},
		email: {
			type: _graphql.GraphQLString,
			description: 'The email of the user'
		},
		userId: {
			type: _graphql.GraphQLID,
			description: 'Id of the user'
		},
		access_token: {
			type: _graphql.GraphQLString,
			description: 'A JWT token that grants access for a short amount of time'
		},
		refresh_token: {
			type: _graphql.GraphQLString,
			description: 'A JWT token that allows the user to request a new access token (keep this secure)'
		}
	}
});

exports.default = authType;