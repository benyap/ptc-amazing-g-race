import { combineReducers } from 'redux';

import authReducer from './authReducer';


export default (apolloClient) => {
	const reducers = {
		auth: authReducer,
		apollo: apolloClient.reducer()
	}

	return combineReducers(reducers);
};
