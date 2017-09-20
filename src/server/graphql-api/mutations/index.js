import settingMutation from './settingMutation';
import userMutation from './userMutation';
import authMutation from './authMutation';
import teamMutation from './teamMutation';


export default {
	...settingMutation,
	...userMutation,
	...authMutation,
	...teamMutation
};
