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

var setSetting = {
	type: _types2.default.confirmType,
	description: 'Set the value of a setting (only for single value settings)',
	args: {
		key: {
			name: 'key',
			description: 'The key (name) of the setting to modify',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		value: {
			name: 'value',
			description: 'The value to set the setting to',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.settingResolver.setSetting(root, params, ctx, options);
	}
};

var addSetting = {
	type: _types2.default.confirmType,
	description: 'Add a value to a setting (only for multi-value settings)',
	args: {
		key: {
			name: 'key',
			description: 'The key (name) of the setting to modify',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		value: {
			name: 'value',
			description: 'The value to add',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.settingResolver.addSetting(root, params, ctx, options);
	}
};

var removeSetting = {
	type: _types2.default.confirmType,
	description: 'Remove a value from a setting (only for multi-value settings)',
	args: {
		key: {
			name: 'key',
			description: 'The key (name) of the setting to modify',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		},
		value: {
			name: 'value',
			description: 'The value to remove',
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString)
		}
	},
	resolve: function resolve(root, params, ctx, options) {
		return _resolvers2.default.settingResolver.removeSetting(root, params, ctx, options);
	}
};

exports.default = {
	setSetting: setSetting,
	addSetting: addSetting,
	removeSetting: removeSetting
};