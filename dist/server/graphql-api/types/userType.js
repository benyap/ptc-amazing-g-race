'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var _graphqlIsoDate = require('graphql-iso-date');

var _raceDetailsType = require('./raceDetailsType');

var _raceDetailsType2 = _interopRequireDefault(_raceDetailsType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userType = new _graphql.GraphQLObjectType({
	name: 'User',
	description: 'A user',
	fields: {
		_id: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
		},
		firstname: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'First name of the user'
		},
		lastname: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'Last name of the user'
		},
		username: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The user\'s username'
		},
		studentID: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The user\'s student ID'
		},
		university: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The university the user attends'
		},
		email: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'Email of the user'
		},
		mobileNumber: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The user\'s mobile number'
		},
		registerDate: {
			type: new _graphql.GraphQLNonNull(_graphqlIsoDate.GraphQLDateTime),
			description: 'The date the user registered'
		},
		enabled: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'True if the user is enabled (disabled users cannot log in)'
		},
		paidAmount: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat),
			description: 'The amount the user has paid'
		},
		raceDetails: {
			type: new _graphql.GraphQLNonNull(_raceDetailsType2.default),
			description: 'The user\'s race details'
		},
		roles: {
			type: new _graphql.GraphQLList(_graphql.GraphQLString),
			description: 'List of roles assigned to the user'
		},
		permissions: {
			type: new _graphql.GraphQLList(_graphql.GraphQLString),
			description: 'List of permissions assigned to the user'
		}
	}
});

exports.default = userType;