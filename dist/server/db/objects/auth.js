"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _connect = require("../connect");

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");

var login = function login(user, email, password) {
	return _login(user, email, password, false);
};

var adminLogin = function adminLogin(user, email, password) {
	return _login(user, email, password, true);
};

/**
 * Create JWT tokens for a user if correct credentials are provided.
 * @param {*} user 
 * @param {String} email 
 * @param {String} password 
 */
var _login = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, email, password, isAdmin) {
		var db, userauthentication, isMatch, _user, access_token, refresh_token;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (!user) {
							_context.next = 4;
							break;
						}

						return _context.abrupt("return", new Error('Already logged in'));

					case 4:
						email = email.toLowerCase();

						// Connect to MongoDB and verify authentication
						_context.next = 7;
						return (0, _connect2.default)();

					case 7:
						db = _context.sent;
						userauthentication = void 0;

						if (!isAdmin) {
							_context.next = 15;
							break;
						}

						_context.next = 12;
						return db.collection('userauthentications').findOne({ email: email, isAdmin: isAdmin });

					case 12:
						userauthentication = _context.sent;
						_context.next = 18;
						break;

					case 15:
						_context.next = 17;
						return db.collection('userauthentications').findOne({ email: email });

					case 17:
						userauthentication = _context.sent;

					case 18:
						if (userauthentication) {
							_context.next = 20;
							break;
						}

						return _context.abrupt("return", {
							ok: false,
							message: 'User not found',
							email: email
						});

					case 20:
						_context.next = 22;
						return _bcryptjs2.default.compare(password, userauthentication.password);

					case 22:
						isMatch = _context.sent;

						if (isMatch) {
							_context.next = 27;
							break;
						}

						return _context.abrupt("return", {
							ok: false,
							message: 'Invalid credentials',
							email: email
						});

					case 27:
						_context.next = 29;
						return db.collection('users').findOne({ email: email });

					case 29:
						_user = _context.sent;

						if (_user.enabled) {
							_context.next = 34;
							break;
						}

						return _context.abrupt("return", {
							ok: false,
							message: 'User is not enabled',
							email: email
						});

					case 34:
						// Generate tokens
						access_token = _generateAccessToken(_user);
						refresh_token = _generateRefreshToken(_user);
						return _context.abrupt("return", {
							ok: true,
							message: 'Log in successful',
							email: _user.email,
							userId: _user._id,
							username: _user.username,
							access_token: access_token,
							refresh_token: refresh_token
						});

					case 37:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function _login(_x, _x2, _x3, _x4) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * Verify a refresh token and generate a new access token if valid
 * @param {*} user 
 * @param {String} refreshToken 
 */
var refresh = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user, refreshToken) {
		var db, result, payload, token, userTokenOwner, access_token;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context2.sent;
						_context2.next = 5;
						return db.collection('refreshtokens').remove({ expiry: { $lt: Date.now() / 1000 } });

					case 5:
						result = _context2.sent;

						if (result.result.n > 0) console.log('Removed ' + result.result.n + ' expired refresh token(s)');

						_context2.prev = 7;

						// Verify refresh token
						payload = _jsonwebtoken2.default.verify(refreshToken, process.env.JWT_SECRET);

						// Refresh token valid

						if (!payload) {
							_context2.next = 31;
							break;
						}

						_context2.next = 12;
						return db.collection('refreshtokens').findOne({ token: refreshToken });

					case 12:
						token = _context2.sent;

						if (token) {
							_context2.next = 17;
							break;
						}

						// Refresh token not found, invalidate all tokens by user
						db.collection('refreshtokens').update(
						// Selector
						{ email: payload.email },
						// Update
						{ $set: { valid: false, invalidatedOn: Date.now() } },
						// Options
						{ multi: true });
						_context2.next = 31;
						break;

					case 17:
						if (token.valid) {
							_context2.next = 21;
							break;
						}

						return _context2.abrupt("return", {
							ok: false,
							message: 'Token invalidated',
							email: payload.email
						});

					case 21:
						_context2.next = 23;
						return db.collection('users').findOne({ email: payload.email });

					case 23:
						userTokenOwner = _context2.sent;

						if (userTokenOwner.enabled) {
							_context2.next = 28;
							break;
						}

						return _context2.abrupt("return", {
							ok: false,
							message: 'User is not enabled',
							email: userTokenOwner.email
						});

					case 28:
						// Update number of uses
						db.collection('refreshtokens').update(
						// Selector
						{ token: refreshToken },
						// Update
						{ $push: { uses: Date.now() } });

						// Generate new access token
						access_token = _generateAccessToken(userTokenOwner);
						return _context2.abrupt("return", {
							ok: true,
							message: 'Access token refreshed',
							userId: userTokenOwner._id,
							username: userTokenOwner.username,
							email: userTokenOwner.email,
							access_token: access_token,
							refresh_token: refreshToken
						});

					case 31:
						_context2.next = 40;
						break;

					case 33:
						_context2.prev = 33;
						_context2.t0 = _context2["catch"](7);

						if (!(_context2.t0.name === 'TokenExpiredError')) {
							_context2.next = 39;
							break;
						}

						return _context2.abrupt("return", {
							ok: false,
							message: 'Token expired'
						});

					case 39:
						return _context2.abrupt("return", _context2.t0);

					case 40:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this, [[7, 33]]);
	}));

	return function refresh(_x5, _x6) {
		return _ref2.apply(this, arguments);
	};
}();

/**
 * Generate an access token for the given user.
 */
var _generateAccessToken = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(user) {
		var db, JWT_ACCESS_EXPIRY_raw, JWT_ACCESS_EXPIRY;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context3.sent;
						_context3.next = 5;
						return db.collection('settings').findOne({ key: 'auth_jwt_access_expiry' });

					case 5:
						JWT_ACCESS_EXPIRY_raw = _context3.sent;
						JWT_ACCESS_EXPIRY = JWT_ACCESS_EXPIRY_raw.value;
						return _context3.abrupt("return", _generateToken(user, JWT_ACCESS_EXPIRY));

					case 8:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function _generateAccessToken(_x7) {
		return _ref3.apply(this, arguments);
	};
}();

/**
 * Generate a refresh token for the given user.
 */
var _generateRefreshToken = function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(user) {
		var db, JWT_REFRESH_EXPIRY_raw, JWT_REFRESH_EXPIRY, token, decoded, refresh;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context4.sent;
						_context4.next = 5;
						return db.collection('settings').findOne({ key: 'auth_jwt_refresh_expiry' });

					case 5:
						JWT_REFRESH_EXPIRY_raw = _context4.sent;
						JWT_REFRESH_EXPIRY = JWT_REFRESH_EXPIRY_raw.value;
						token = _generateToken(user, JWT_REFRESH_EXPIRY);
						_context4.next = 10;
						return _jsonwebtoken2.default.decode(token);

					case 10:
						decoded = _context4.sent;


						// Keep a record of the generated refresh token
						// This will be black listed if the user logs out
						refresh = {
							email: user.email,
							valid: true,
							token: token,
							expiry: decoded.exp,
							created: new Date(),
							uses: []

							// Add refresh token to db
						};
						db.collection('refreshtokens').insert(refresh);

						return _context4.abrupt("return", token);

					case 14:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, this);
	}));

	return function _generateRefreshToken(_x8) {
		return _ref4.apply(this, arguments);
	};
}();

/**
 * Generate a token for the given user,
 * with the speciifed expiry time in seconds.
 * @param {*} user 
 * @param {number} expiresIn
 */
var _generateToken = function _generateToken(user, expiresIn) {
	// Payload data for the token
	var payload = {
		userId: user._id.toString(),
		username: user.username,
		email: user.email
	};

	return _jsonwebtoken2.default.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
};

/**
 * Logout a user by revoking their refresh token.
 * Access token should be removed by the client.
 * @param {*} user 
 * @param {String} refreshToken 
 */
var logout = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user, refreshToken) {
		var payload, db, result;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.prev = 0;

						// Verify refresh token
						payload = _jsonwebtoken2.default.verify(refreshToken, process.env.JWT_SECRET);

						if (!payload) {
							_context5.next = 18;
							break;
						}

						_context5.next = 5;
						return (0, _connect2.default)();

					case 5:
						db = _context5.sent;
						_context5.next = 8;
						return db.collection('refreshtokens').update(
						// Selector
						{ email: user ? user.email : payload.email, token: refreshToken, valid: true },
						// Update
						{ $set: { valid: false, invalidatedOn: Date.now() } });

					case 8:
						result = _context5.sent;

						if (!(result.result.n === 1)) {
							_context5.next = 17;
							break;
						}

						if (!(result.result.nModified === 1)) {
							_context5.next = 14;
							break;
						}

						return _context5.abrupt("return", { ok: true });

					case 14:
						return _context5.abrupt("return", {
							ok: false,
							failureMessage: 'Token already invalidated'
						});

					case 15:
						_context5.next = 18;
						break;

					case 17:
						return _context5.abrupt("return", {
							ok: false,
							failureMessage: 'No token invalidated'
						});

					case 18:
						_context5.next = 23;
						break;

					case 20:
						_context5.prev = 20;
						_context5.t0 = _context5["catch"](0);
						return _context5.abrupt("return", {
							ok: false,
							failureMessage: 'Invalid refresh token'
						});

					case 23:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee5, this, [[0, 20]]);
	}));

	return function logout(_x9, _x10) {
		return _ref5.apply(this, arguments);
	};
}();

/**
 * Change a user's password. Their current password must be provided.
 * @param {*} user 
 * @param {String} currentPassword 
 * @param {String} newPassword 
 * @param {String} confirmPassword 
 */
var changePassword = function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(user, currentPassword, newPassword, confirmPassword) {
		var db, userauthentication, isMatch, minLength_raw, minLength, salt, hash, result, action;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						if (user) {
							_context6.next = 4;
							break;
						}

						return _context6.abrupt("return", new Error('Not logged in'));

					case 4:
						_context6.next = 6;
						return (0, _connect2.default)();

					case 6:
						db = _context6.sent;
						_context6.next = 9;
						return db.collection('userauthentications').findOne({ email: user.email });

					case 9:
						userauthentication = _context6.sent;

						if (userauthentication) {
							_context6.next = 12;
							break;
						}

						return _context6.abrupt("return", new Error('User not found'));

					case 12:
						_context6.next = 14;
						return _bcryptjs2.default.compare(currentPassword, userauthentication.password);

					case 14:
						isMatch = _context6.sent;

						if (isMatch) {
							_context6.next = 19;
							break;
						}

						return _context6.abrupt("return", {
							ok: false,
							failureMessage: 'Invalid credentials'
						});

					case 19:
						_context6.next = 21;
						return db.collection('settings').findOne({ key: 'auth_password_min_length' });

					case 21:
						minLength_raw = _context6.sent;
						minLength = minLength_raw.value;

						if (!(currentPassword.length < minLength)) {
							_context6.next = 25;
							break;
						}

						return _context6.abrupt("return", {
							ok: false,
							failureMessage: 'Password must be at least 6 characters'
						});

					case 25:
						if (!(newPassword === currentPassword)) {
							_context6.next = 27;
							break;
						}

						return _context6.abrupt("return", {
							ok: false,
							failureMessage: 'New password must be different from old password'
						});

					case 27:
						if (!(newPassword !== confirmPassword)) {
							_context6.next = 29;
							break;
						}

						return _context6.abrupt("return", {
							ok: false,
							failureMessage: 'New passwords do not match'
						});

					case 29:
						_context6.next = 31;
						return _bcryptjs2.default.genSalt(10);

					case 31:
						salt = _context6.sent;
						_context6.next = 34;
						return _bcryptjs2.default.hash(newPassword, salt);

					case 34:
						hash = _context6.sent;
						_context6.next = 37;
						return db.collection('userauthentications').update({ email: user.email }, { $set: { password: hash } });

					case 37:
						result = _context6.sent;

						if (!(result.result.nModified === 1)) {
							_context6.next = 44;
							break;
						}

						// Log change password action
						action = {
							action: 'Change password',
							target: user.username,
							targetCollection: 'userauthentications',
							date: new Date(),
							who: user.username
						};


						db.collection('actions').insert(action);

						return _context6.abrupt("return", {
							ok: true,
							action: action
						});

					case 44:
						return _context6.abrupt("return", new Error('Unable to change password: database error'));

					case 45:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee6, this);
	}));

	return function changePassword(_x11, _x12, _x13, _x14) {
		return _ref6.apply(this, arguments);
	};
}();

/**
 * Check if authentication was successful
 * @param {*} user 
 */
var authenticate = function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(user) {
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						if (!user) {
							_context7.next = 4;
							break;
						}

						return _context7.abrupt("return", { ok: true });

					case 4:
						return _context7.abrupt("return", { ok: false });

					case 5:
					case "end":
						return _context7.stop();
				}
			}
		}, _callee7, this);
	}));

	return function authenticate(_x15) {
		return _ref7.apply(this, arguments);
	};
}();

exports.default = {
	login: login,
	adminLogin: adminLogin,
	refresh: refresh,
	logout: logout,
	changePassword: changePassword,
	authenticate: authenticate
};