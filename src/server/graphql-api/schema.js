import {
	GraphQLObjectType,
	GraphQLSchema
} from 'graphql';

import queries from './queries';
import mutations from './mutations';


/**
 * Create a GraphQL Schema that contains all queries and mutations for the database
 */
 const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		description: 'Database queries that do not mutate the database',
		fields: queries
	}),
	// mutation: new GraphQLObjectType({
	// 	name: 'Mutation',
	// 	description: 'Database mutations',
	// 	fields: mutations
	// })
});


export default schema;
