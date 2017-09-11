import {
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const getSetting = {
	type: types.settingType,
	description: 'Get a setting',
	args: {
		key: {
			name: 'key',
			description: 'The setting key (name)',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.settingResolver.getSetting(root, params, ctx, options);
	}
};


const getSettings = {
	type: new GraphQLList(types.settingType),
	description: 'Get the list of settings',
	args: {
		skip: {
			name: 'skip',
			description: 'Number of records to skip',
			type: GraphQLInt
		},
		limit: {
			name: 'limit',
			description: 'Number of records to return',
			type: GraphQLInt
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.settingResolver.getSettings(root, params, ctx, options);
	}
};


const getPublicSetting = {
	type: types.settingType,
	description: 'Get a public setting',
	args: {
		key: {
			name: 'key',
			description: 'The setting key (name)',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.settingResolver.getPublicSetting(root, params, ctx, options);
	}
}


export default {
	getSetting,
	getPublicSetting,
	getSettings
};
