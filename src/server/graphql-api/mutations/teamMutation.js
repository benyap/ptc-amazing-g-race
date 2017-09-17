import {
	GraphQLString,
	GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const addTeam = {
	type: types.confirmType,
	description: 'Add a new team',
	args: {
		teamName: {
			name: 'teanName',
			description: 'The name of the team',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.teamResolver.addTeam(root, params, ctx, options);
	}
}


export default {
	addTeam
};
