import database from '../../db';


// Login user 
const login = function(root, params, ctx, options) {
	return database.auth.login(ctx.user, params.email, params.password);
}

// Refresh token
const refresh = function(root, params, ctx, options) {
	return database.auth.refresh(ctx.user, params.refreshToken);
}

// Logout user
const logout = function(root, params, ctx, options) {
	return database.auth.logout(ctx.user, params.refreshToken);
}

// Change password
const changePassword = function(root, params, ctx, options) {
	return database.auth.changePassword(ctx.user, params.currentPassword, params.newPassword, params.confirmPassword);
}

// Check authentication
const authenticate = function(root, params, ctx, options) {
	return database.auth.authenticate(ctx.user);
}


export default {
	login,
	refresh,
	logout,
	changePassword,
	authenticate
};
