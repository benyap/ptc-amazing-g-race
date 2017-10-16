import { combineReducers } from 'redux';

import authReducer from './authReducer';
import stateReducer from './stateReducer';
import settingsReducer from './settingsReducer';

export default (apolloClient) => {
	const reducers = {
		auth: authReducer,
		state: stateReducer,
		settings: settingsReducer,
		apollo: apolloClient.reducer()
	}

	return combineReducers(reducers);
};
