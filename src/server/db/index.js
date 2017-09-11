import connect from './connect';
import permission from './permission';
import setting from './objects/setting';
import user from './objects/user';
import auth from './objects/auth';


/**
 * The DB package is used to handle the connection to MongoDB
 * and all actions to be performed with the database. 
 */
export default {
	connect,
	permission,
	setting,
	user,
	auth
};
