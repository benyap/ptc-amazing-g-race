'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var permissionCheckType = new _graphql.GraphQLObjectType({
	name: 'PermissionCheckResult',
	description: 'Result of a permission check',
	fields: {
		username: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The username of the user being checked'
		},
		permission: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The permission being checked for'
		},
		ok: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'True if the user has the permission'
		}
	}
});

exports.default = permissionCheckType;