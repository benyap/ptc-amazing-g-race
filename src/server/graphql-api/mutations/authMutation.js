import {
	GraphQLString,
	GraphQLID,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const login = {
	type: types.authType,
	description: 'Provide login credentials for an access token',
	args: {
		email: {
			name: 'email',
			description: 'Email used to identify the user',
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			name: 'password',
			description: 'Account password',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.authResolver.login(root, params, ctx, options);
	}
};


const adminLogin = {
	type: types.authType,
	description: 'Provide administrator login credentials for an access token',
	args: {
		email: {
			name: 'email',
			description: 'Email used to identify the user',
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			name: 'password',
			description: 'Account password',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.authResolver.adminLogin(root, params, ctx, options);
	}
};


const refresh = {
	type: types.authType,
	description: 'Request a new access token with a valid refresh token. This will log the time the refresh token was used.',
	args: {
		refreshToken: {
			name: 'refreshToken',
			description: 'The refresh token for authentication',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.authResolver.refresh(root, params, ctx, options);
	}
}


const logout = {
	type: types.confirmType,
	description: 'Logout a user by revoking their refresh token (client responsibility to remove the access token)',
	args: {
		refreshToken: {
			name: 'refreshToken',
			description: 'The refresh token to revoke',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.authResolver.logout(root, params, ctx, options);
	}
}


const changePassword = {
	type: types.confirmType,
	description: 'Change a user\'s password',
	args: {
		currentPassword: {
			name: 'currentPassword',
			description: 'The user\'s current password',
			type: new GraphQLNonNull(GraphQLString)
		},
		newPassword: {
			name: 'newPassword',
			description: 'A new password',
			type: new GraphQLNonNull(GraphQLString)
		},
		confirmPassword: {
			name: 'confirmPassword',
			description: 'Confirm the new password',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.authResolver.changePassword(root, params, ctx, options);
	}
}


const resetPassword = {
	type: types.confirmType,
	description: 'Reset a user\'s password',
	args: {
		username: {
			name: 'username',
			description: 'The user\'s username',
			type: new GraphQLNonNull(GraphQLString)
		},
		newPassword: {
			name: 'newPassword',
			description: 'A new password',
			type: new GraphQLNonNull(GraphQLString)
		},
		confirmPassword: {
			name: 'confirmPassword',
			description: 'Confirm the new password',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.authResolver.resetPassword(root, params, ctx, options);
	}
}


export default {
	login,
	adminLogin,
	refresh,
	logout,
	changePassword,
	resetPassword
};
