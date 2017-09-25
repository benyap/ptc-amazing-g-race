import settingMutation from './settingMutation';
import userMutation from './userMutation';
import authMutation from './authMutation';
import teamMutation from './teamMutation';
import articleMutation from './articleMutation';


export default {
	...settingMutation,
	...userMutation,
	...authMutation,
	...teamMutation,
	...articleMutation
};
