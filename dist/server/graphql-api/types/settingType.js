'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var _graphqlIsoDate = require('graphql-iso-date');

var settingType = new _graphql.GraphQLObjectType({
	name: 'Setting',
	description: 'A setting key-value pair.',
	fields: {
		_id: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
		},
		key: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The name of the setting'
		},
		public: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'True if this setting is available to the public'
		},
		valueType: {
			type: new _graphql.GraphQLEnumType({
				name: 'ValueType',
				values: {
					integer: { value: 'integer' },
					integerList: { value: 'integerList' },
					string: { value: 'string' },
					stringList: { value: 'stringList' }
				}
			}),
			description: 'The expected type of the value(s)'
		},
		value: {
			type: _graphql.GraphQLString,
			description: 'The value of the setting'
		},
		values: {
			type: new _graphql.GraphQLList(_graphql.GraphQLString),
			description: 'Values of the setting'
		},
		modifiableRoles: {
			type: new _graphql.GraphQLList(_graphql.GraphQLString),
			description: 'User roles which grant access to modify this permission (leave blank to allow all users with appropriate permissions)'
		},
		modified: {
			type: new _graphql.GraphQLNonNull(_graphqlIsoDate.GraphQLDateTime),
			description: 'The time this setting was last modified'
		},
		modifiedBy: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The user that last modified the setting'
		}
	}
});

exports.default = settingType;