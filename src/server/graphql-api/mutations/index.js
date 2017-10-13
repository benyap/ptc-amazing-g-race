import settingMutation from './settingMutation';
import userMutation from './userMutation';
import authMutation from './authMutation';
import teamMutation from './teamMutation';
import articleMutation from './articleMutation';
import uploadMutation from './uploadMutation';
import challengeMutation from './challengeMutation';
import responseMutation from './responseMutation';


export default {
	...settingMutation,
	...userMutation,
	...authMutation,
	...teamMutation,
	...articleMutation,
	...uploadMutation,
	...challengeMutation,
	...responseMutation
};
