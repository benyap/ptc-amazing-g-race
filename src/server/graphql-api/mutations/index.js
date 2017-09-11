import settingMutation from './settingMutation';
import userMutation from './userMutation';
import authMutation from './authMutation';


export default {
	...settingMutation,
	...userMutation,
	...authMutation
};
