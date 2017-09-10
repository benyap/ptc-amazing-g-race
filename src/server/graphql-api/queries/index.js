import Type from '../types';


export default {
	test: {
		type: Type.confirmType,
		description: 'Test access to GraphQL endpoint',
		resolve() { return { ok : true } }
	}
};
