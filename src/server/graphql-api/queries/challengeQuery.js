import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getAllChallenges = {
	type: new GraphQLList(types.challengeType),
	description: 'Get all challenges',
	args: {
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.getAllChallenges(root, params, ctx, options);
	}
};


const getChallenges = {
	type: new GraphQLList(types.challengeType),
	description: 'Get challenges the user is permitted to see',
	args: {
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.getChallenges(root, params, ctx, options);
	}
}


const getChallenge = {
	type: types.challengeType,
	description: 'Get a challenge the user is permitted to see (admins excepted)',
	args: {
		key: {
			name: 'key',
			type: new GraphQLNonNull(GraphQLString),
			description: 'The key of the challenge to get'
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.getChallenge(root, params, ctx, options);
	}
}


const getChallengeById = {
	type: types.challengeType,
	description: 'Get a challenge the user is permitted to see',
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLID),
			description: 'The id of the challenge to get'
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.challengeResolver.getChallengeById(root, params, ctx, options);
	}
}


export default {
	getAllChallenges,
	getChallenges,
	getChallenge,
	getChallengeById
};
