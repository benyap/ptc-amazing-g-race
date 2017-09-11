import types from '../types';
import settingQuery from './settingQuery';
import userQuery from './userQuery';


export default {
	test: {
		type: types.confirmType,
		description: 'Test access to GraphQL endpoint',
		resolve() { return { ok : true } }
	},
	...settingQuery,
	...userQuery
};
