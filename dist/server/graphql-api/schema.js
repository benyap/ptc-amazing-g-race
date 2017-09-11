'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _graphql = require('graphql');

var _queries = require('./queries');

var _queries2 = _interopRequireDefault(_queries);

var _mutations = require('./mutations');

var _mutations2 = _interopRequireDefault(_mutations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a GraphQL Schema that contains all queries and mutations for the database
 */
var schema = new _graphql.GraphQLSchema({
	query: new _graphql.GraphQLObjectType({
		name: 'Query',
		description: 'Database queries that do not mutate the database',
		fields: _queries2.default
	}),
	mutation: new _graphql.GraphQLObjectType({
		name: 'Mutation',
		description: 'Database mutations',
		fields: _mutations2.default
	})
});

exports.default = schema;