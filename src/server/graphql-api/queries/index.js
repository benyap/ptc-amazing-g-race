import types from '../types';
import settingQuery from './settingQuery';
import userQuery from './userQuery';
import teamQuery from './teamQuery';
import articleQuery from './articleQuery';
import uploadQuery from './uploadQuery';
import challengeQuery from './challengeQuery';
import responseQuery from './responseQuery';


export default {
	test: {
		type: types.confirmType,
		description: 'Test access to GraphQL endpoint',
		resolve() { return { ok : true } }
	},
	...settingQuery,
	...userQuery,
	...teamQuery,
	...articleQuery,
	...uploadQuery,
	...challengeQuery,
	...responseQuery
};
