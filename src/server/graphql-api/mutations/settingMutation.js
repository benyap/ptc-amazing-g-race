import {
	GraphQLString,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const setSetting = {
	type: types.confirmType,
	description: 'Set the value of a setting (only for single value settings)',
	args: {
		key: {
			name: 'key',
			description: 'The key (name) of the setting to modify',
			type: new GraphQLNonNull(GraphQLString)
		},
		value: {
			name: 'value',
			description: 'The value to set the setting to',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.settingResolver.setSetting(root, params, ctx, options);
	}
}


const addSetting = {
	type: types.confirmType,
	description: 'Add a value to a setting (only for multi-value settings)',
	args: {
		key: {
			name: 'key',
			description: 'The key (name) of the setting to modify',
			type: new GraphQLNonNull(GraphQLString)
		},
		value: {
			name: 'value',
			description: 'The value to add',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.settingResolver.addSetting(root, params, ctx, options);
	}
}


const removeSetting = {
	type: types.confirmType,
	description: 'Remove a value from a setting (only for multi-value settings)',
	args: {
		key: {
			name: 'key',
			description: 'The key (name) of the setting to modify',
			type: new GraphQLNonNull(GraphQLString)
		},
		value: {
			name: 'value',
			description: 'The value to remove',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.settingResolver.removeSetting(root, params, ctx, options);
	}
}


export default {
	setSetting,
	addSetting,
	removeSetting
};
