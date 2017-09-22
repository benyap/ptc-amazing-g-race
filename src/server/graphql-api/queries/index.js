import types from '../types';
import settingQuery from './settingQuery';
import userQuery from './userQuery';
import teamQuery from './teamQuery';


export default {
	test: {
		type: types.confirmType,
		description: 'Test access to GraphQL endpoint',
		resolve() { return { ok : true } }
	},
	...settingQuery,
	...userQuery,
	...teamQuery
};
