import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userInfoReducer from './userInfoReducer';
import stateReducer from './stateReducer';
import settingsReducer from './settingsReducer';

export default (apolloClient) => {
	const reducers = {
		auth: authReducer,
		userInfo: userInfoReducer,
		state: stateReducer,
		settings: settingsReducer,
		apollo: apolloClient.reducer()
	}

	return combineReducers(reducers);
};
