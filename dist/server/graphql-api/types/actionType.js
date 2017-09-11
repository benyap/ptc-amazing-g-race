'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var _graphqlIsoDate = require('graphql-iso-date');

var actionType = new _graphql.GraphQLObjectType({
	name: 'Action',
	description: 'An action keeps track of something a user has done to mutate the database',
	fields: {
		_id: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLID)
		},
		action: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The action taken'
		},
		targetCollection: {
			type: _graphql.GraphQLString,
			description: 'The collection to which the target belongs'
		},
		target: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The target of the action. This could be a username or an object Id.'
		},
		who: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
			description: 'The username of the user who executed this action'
		},
		date: {
			type: new _graphql.GraphQLNonNull(_graphqlIsoDate.GraphQLDateTime),
			description: 'The date the action was executed'
		},
		infoJSONString: {
			type: _graphql.GraphQLString,
			description: 'A string representation of a JSON object with more information about the action'
		}
	}
});

exports.default = actionType;