'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var _actionType = require('./actionType');

var _actionType2 = _interopRequireDefault(_actionType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var confirmType = new _graphql.GraphQLObjectType({
	name: 'Confirm',
	description: 'Confirm whether an action was successful',
	fields: {
		ok: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'True if the action was successful'
		},
		action: {
			type: _actionType2.default,
			description: 'A log of the action that was executed (some actions do not provide an action log)'
		},
		failureMessage: {
			type: _graphql.GraphQLString,
			description: 'A description of the failure if the action failed'
		}
	}
});

exports.default = confirmType;