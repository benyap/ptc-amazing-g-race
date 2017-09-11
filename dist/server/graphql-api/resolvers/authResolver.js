'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _db = require('../../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Login user 
var login = function login(root, params, ctx, options) {
	return _db2.default.auth.login(ctx.user, params.email, params.password);
};

// Login administrator 
var adminLogin = function adminLogin(root, params, ctx, options) {
	return _db2.default.auth.adminLogin(ctx.user, params.email, params.password);
};

// Refresh token
var refresh = function refresh(root, params, ctx, options) {
	return _db2.default.auth.refresh(ctx.user, params.refreshToken);
};

// Logout user
var logout = function logout(root, params, ctx, options) {
	return _db2.default.auth.logout(ctx.user, params.refreshToken);
};

// Change password
var changePassword = function changePassword(root, params, ctx, options) {
	return _db2.default.auth.changePassword(ctx.user, params.currentPassword, params.newPassword, params.confirmPassword);
};

// Check authentication
var authenticate = function authenticate(root, params, ctx, options) {
	return _db2.default.auth.authenticate(ctx.user);
};

exports.default = {
	login: login,
	adminLogin: adminLogin,
	refresh: refresh,
	logout: logout,
	changePassword: changePassword,
	authenticate: authenticate
};