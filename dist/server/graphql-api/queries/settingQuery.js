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

var getSetting = {
	type: _types2.default.settingType,
	description: 'Get a setting',
	args: {
		key: {
			name: 'key',
			description: 'The setting key (name)',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.settingResolver.getSetting(root, params, ctx, options);
	}
};

var getSettings = {
	type: new _graphql.GraphQLList(_types2.default.settingType),
	description: 'Get the list of settings',
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
		return _resolvers2.default.settingResolver.getSettings(root, params, ctx, options);
	}
};

var getPublicSetting = {
	type: _types2.default.settingType,
	description: 'Get a public setting',
	args: {
		key: {
			name: 'key',
			description: 'The setting key (name)',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.settingResolver.getPublicSetting(root, params, ctx, options);
	}
};

exports.default = {
	getSetting: getSetting,
	getPublicSetting: getPublicSetting,
	getSettings: getSettings
};