import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userInfoReducer from './userInfoReducer';

export default (apolloClient) => {
	const reducers = {
		auth: authReducer,
		userInfo: userInfoReducer,
		apollo: apolloClient.reducer()
	}

	return combineReducers(reducers);
};
