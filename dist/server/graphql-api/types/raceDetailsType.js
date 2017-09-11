'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var raceDetailsType = new _graphql.GraphQLObjectType({
	name: 'RaceDetails',
	description: 'A user\'s race details',
	fields: {
		publicTransport: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLInt),
			description: 'How confident are you in taking public transport and using maps?'
		},
		smartphone: {
			type: new _graphql.GraphQLNonNull(_graphql.GraphQLBoolean),
			description: 'Do you have a smartphone that you can use on the day?'
		},
		friends: {
			type: _graphql.GraphQLString,
			description: 'List two other people you want on your team'
		}
	}
});

exports.default = raceDetailsType;