import axios from 'axios';

/**
 * Log in a user by setting their email, accces and refresh tokens in the store, and `authenticted` will be set to true.
 * If `remember` is set to true, the email will be retained on logout.
 * @param {*} email 
 * @param {*} access 
 * @param {*} refresh 
 * @param {*} remember 
 * @param {*} time 
 */
export function login(email, access, refresh, remember, time) {
	return {
		type: 'AUTH_LOGIN',
		payload: {
			email,
			remember,
			access,
			refresh,
			time
		}
	}
}

/**
 * Refresh the user's access token.
 * This will increase `refreshCount` by 1. 
 * This method will not do anything if the user is not logged in. 
 * @param {*} access 
 * @param {*} time 
 */
export function refresh(access, time) {
	return {
		type: 'AUTH_REFRESH',
		payload: {
			access,
			time
		}
	}
}

/**
 * Log out a user by destroying their tokens in the store.
 * If `remember` was set to true, their email will NOT be removed from the store.
 * @param {*} time 
 */
export function logout(time) {
	return {
		type: 'AUTH_LOGOUT',
		payload: {
			time
		}
	}
}
