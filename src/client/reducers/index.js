import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userInfoReducer from './userInfoReducer';
import stateReducer from './stateReducer';

export default (apolloClient) => {
	const reducers = {
		auth: authReducer,
		userInfo: userInfoReducer,
		state: stateReducer,
		apollo: apolloClient.reducer()
	}

	return combineReducers(reducers);
};
