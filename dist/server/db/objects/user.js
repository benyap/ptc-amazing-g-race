"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _mongodb = require("mongodb");

var _mongodb2 = _interopRequireDefault(_mongodb);

var _connect = require("../connect");

var _connect2 = _interopRequireDefault(_connect);

var _permission = require("../permission");

var _permission2 = _interopRequireDefault(_permission);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");

/**
 * Get the a user from the database by Id
 * @param {*} user 
 * @param {String} userId 
 */
var getUserById = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, userId) {
		var authorized, db;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						if (user) {
							_context.next = 4;
							break;
						}

						return _context.abrupt("return", new Error('No user logged in'));

					case 4:
						_context.next = 6;
						return _permission2.default.checkPermission(user, ['user:view-users']);

					case 6:
						authorized = _context.sent;

						if (!(authorized !== true)) {
							_context.next = 9;
							break;
						}

						return _context.abrupt("return", authorized);

					case 9:
						_context.next = 11;
						return (0, _connect2.default)();

					case 11:
						db = _context.sent;
						return _context.abrupt("return", db.collection('users').findOne({ _id: _mongodb2.default.ObjectID(userId) }));

					case 13:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function getUserById(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * Get the a user from the database by username
 * @param {*} user 
 * @param {String} username 
 */
var getUserByUsername = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user, username) {
		var authorized, db;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						if (user) {
							_context2.next = 4;
							break;
						}

						return _context2.abrupt("return", new Error('No user logged in'));

					case 4:
						_context2.next = 6;
						return _permission2.default.checkPermission(user, ['user:view-users']);

					case 6:
						authorized = _context2.sent;

						if (!(authorized !== true)) {
							_context2.next = 9;
							break;
						}

						return _context2.abrupt("return", authorized);

					case 9:
						_context2.next = 11;
						return (0, _connect2.default)();

					case 11:
						db = _context2.sent;
						return _context2.abrupt("return", db.collection('users').findOne({ username: username.toLowerCase() }));

					case 13:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getUserByUsername(_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}();

/**
 * Get the a user from the database by email
 * @param {*} user 
 * @param {String} email 
 */
var getUserByEmail = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(user, email) {
		var authorized, db;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						if (user) {
							_context3.next = 4;
							break;
						}

						return _context3.abrupt("return", new Error('No user logged in'));

					case 4:
						_context3.next = 6;
						return _permission2.default.checkPermission(user, ['user:view-users']);

					case 6:
						authorized = _context3.sent;

						if (!(authorized !== true)) {
							_context3.next = 9;
							break;
						}

						return _context3.abrupt("return", authorized);

					case 9:
						_context3.next = 11;
						return (0, _connect2.default)();

					case 11:
						db = _context3.sent;
						return _context3.abrupt("return", db.collection('users').findOne({ email: email.toLowerCase() }));

					case 13:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function getUserByEmail(_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}();

/**
 * Get the current logged in user
 * @param {*} user 
 */
var getMe = function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(user) {
		var db;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						if (user) {
							_context4.next = 4;
							break;
						}

						return _context4.abrupt("return", new Error('No user logged in'));

					case 4:
						_context4.next = 6;
						return (0, _connect2.default)();

					case 6:
						db = _context4.sent;
						return _context4.abrupt("return", db.collection('users').findOne({ _id: _mongodb2.default.ObjectID(user.userId) }));

					case 8:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, this);
	}));

	return function getMe(_x7) {
		return _ref4.apply(this, arguments);
	};
}();

/**
 * Check if a user parameter is unique in the database
 * @param {*} user
 * @param {String} parameter
 * @param {String} value
 */
var checkUnique = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user, parameter, value) {
		var db, result;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context5.sent;
						_context5.next = 5;
						return db.collection('users').findOne(_defineProperty({}, parameter, value.toLowerCase()));

					case 5:
						result = _context5.sent;

						if (!result) {
							_context5.next = 10;
							break;
						}

						return _context5.abrupt("return", {
							ok: false,
							failureMessage: parameter[0].toUpperCase() + parameter.slice(1) + ' already exists in database'
						});

					case 10:
						return _context5.abrupt("return", {
							ok: true
						});

					case 11:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee5, this);
	}));

	return function checkUnique(_x8, _x9, _x10) {
		return _ref5.apply(this, arguments);
	};
}();

/**
 * Get a list of all users
 * @param {*} user 
 */
var listAll = function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(user) {
		var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var authorized, db;
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						if (user) {
							_context6.next = 4;
							break;
						}

						return _context6.abrupt("return", new Error('No user logged in'));

					case 4:
						_context6.next = 6;
						return _permission2.default.checkPermission(user, ['user:view-users']);

					case 6:
						authorized = _context6.sent;

						if (!(authorized !== true)) {
							_context6.next = 9;
							break;
						}

						return _context6.abrupt("return", authorized);

					case 9:
						_context6.next = 11;
						return (0, _connect2.default)();

					case 11:
						db = _context6.sent;
						return _context6.abrupt("return", db.collection('users').find({}).skip(skip).limit(limit).toArray());

					case 13:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee6, this);
	}));

	return function listAll(_x11) {
		return _ref6.apply(this, arguments);
	};
}();

/**
 * Check if the specified use has permission
 * @param {*} user
 * @param {String} username
 * @param {String} permission
 */
var checkUserPermission = function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(user, username, permission) {
		var db, userToCheck;
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						if (user) {
							_context7.next = 4;
							break;
						}

						return _context7.abrupt("return", new Error('No user logged in'));

					case 4:
						_context7.next = 6;
						return (0, _connect2.default)();

					case 6:
						db = _context7.sent;
						_context7.next = 9;
						return db.collection('users').findOne({ username: username });

					case 9:
						userToCheck = _context7.sent;

						if (userToCheck) {
							_context7.next = 14;
							break;
						}

						return _context7.abrupt("return", new Error('User \'' + username + '\' not found'));

					case 14:
						if (!(userToCheck.permissions.indexOf(permission) < 0)) {
							_context7.next = 18;
							break;
						}

						return _context7.abrupt("return", { username: username, permission: permission, ok: false });

					case 18:
						return _context7.abrupt("return", { username: username, permission: permission, ok: true });

					case 19:
					case "end":
						return _context7.stop();
				}
			}
		}, _callee7, this);
	}));

	return function checkUserPermission(_x14, _x15, _x16) {
		return _ref7.apply(this, arguments);
	};
}();

/**
 * Add a permission to a user
 * @param {*} user
 * @param {String} username
 * @param {String} permission
 */
var addPermission = function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(user, username, permission) {
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						return _context8.abrupt("return", _modifyProperty('Add', 'permission', user, username, permission));

					case 1:
					case "end":
						return _context8.stop();
				}
			}
		}, _callee8, this);
	}));

	return function addPermission(_x17, _x18, _x19) {
		return _ref8.apply(this, arguments);
	};
}();

/**
 * Remove a permission from a user
 * @param {*} user
 * @param {String} username
 * @param {String} permission
 */
var removePermission = function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(user, username, permission) {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						return _context9.abrupt("return", _modifyProperty('Remove', 'permission', user, username, permission));

					case 1:
					case "end":
						return _context9.stop();
				}
			}
		}, _callee9, this);
	}));

	return function removePermission(_x20, _x21, _x22) {
		return _ref9.apply(this, arguments);
	};
}();

/**
 * Add a role to a user
 * @param {*} user
 * @param {String} username
 * @param {String} role
 */
var addRole = function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(user, username, role) {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						return _context10.abrupt("return", _modifyProperty('Add', 'role', user, username, role));

					case 1:
					case "end":
						return _context10.stop();
				}
			}
		}, _callee10, this);
	}));

	return function addRole(_x23, _x24, _x25) {
		return _ref10.apply(this, arguments);
	};
}();

/**
 * Remove a role from a user
 * @param {*} user
 * @param {String} username
 * @param {String} role
 */
var removeRole = function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(user, username, role) {
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						return _context11.abrupt("return", _modifyProperty('Remove', 'role', user, username, role));

					case 1:
					case "end":
						return _context11.stop();
				}
			}
		}, _callee11, this);
	}));

	return function removeRole(_x26, _x27, _x28) {
		return _ref11.apply(this, arguments);
	};
}();

/**
 * Generic method for modifying a user property (role or permission). 
 * Provide the argument 'Add' as the modifyAction to add a property,
 * or provide the argument 'Remove' as the modifyAction to remove a property.
 * @param {String} modifyAction
 * @param {String} mofidyProperty
 * @param {*} user
 * @param {String} username
 * @param {String} property
 */
var _modifyProperty = function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(modifyAction, modifyProperty, user, username, property) {
		var authorized, db, userToModify, proceed, updateAction, errorPhrase, result, _action;

		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						if (user) {
							_context12.next = 4;
							break;
						}

						return _context12.abrupt("return", new Error('No user logged in'));

					case 4:
						_context12.next = 6;
						return _permission2.default.checkPermission(user, ['admin:modify' + modifyProperty + '-user']);

					case 6:
						authorized = _context12.sent;

						if (!(authorized !== true)) {
							_context12.next = 9;
							break;
						}

						return _context12.abrupt("return", authorized);

					case 9:
						_context12.next = 11;
						return (0, _connect2.default)();

					case 11:
						db = _context12.sent;
						_context12.next = 14;
						return db.collection('users').findOne({ username: username });

					case 14:
						userToModify = _context12.sent;

						if (userToModify) {
							_context12.next = 19;
							break;
						}

						return _context12.abrupt("return", new Error('User \'' + username + '\' not found'));

					case 19:
						proceed = void 0;
						updateAction = void 0;
						errorPhrase = void 0;

						// Check what action to take

						if (!(modifyAction === 'Add')) {
							_context12.next = 28;
							break;
						}

						proceed = userToModify[modifyProperty + 's'].indexOf(property) < 0;
						updateAction = '$push';
						errorPhrase = 'already has';
						_context12.next = 35;
						break;

					case 28:
						if (!(modifyAction === 'Remove')) {
							_context12.next = 34;
							break;
						}

						proceed = userToModify[modifyProperty + 's'].indexOf(property) >= 0;
						updateAction = '$pull';
						errorPhrase = 'does not have';
						_context12.next = 35;
						break;

					case 34:
						throw new Error('Invalid argument in modify ' + modifyProperty + ' function: ' + action);

					case 35:
						if (proceed) {
							_context12.next = 39;
							break;
						}

						return _context12.abrupt("return", new Error('User \'' + username + '\' ' + errorPhrase + ' the ' + modifyProperty + ' <' + property + '>'));

					case 39:
						_context12.next = 41;
						return db.collection('users').update(
						// Selector
						{ username: username },
						// Update
						_defineProperty({}, updateAction, _defineProperty({}, modifyProperty + 's', property)));

					case 41:
						result = _context12.sent;

						if (!(result.result.nModified === 1)) {
							_context12.next = 48;
							break;
						}

						// Log action
						_action = {
							action: modifyAction + ' ' + modifyProperty,
							target: username,
							targetCollection: 'users',
							date: new Date(),
							who: user.username,
							infoJSONString: JSON.stringify(_defineProperty({ username: username }, modifyProperty, property))
						};


						db.collection('actions').insert(_action);

						return _context12.abrupt("return", {
							ok: true,
							action: _action
						});

					case 48:
						return _context12.abrupt("return", new Error('Unable to modify user ' + modifyProperty));

					case 49:
					case "end":
						return _context12.stop();
				}
			}
		}, _callee12, this);
	}));

	return function _modifyProperty(_x29, _x30, _x31, _x32, _x33) {
		return _ref12.apply(this, arguments);
	};
}();

/**
 * Register a new user to the databse.
 * Must have a unique username and email.
 */
var registerUser = function () {
	var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(user, _ref14) {
		var firstname = _ref14.firstname,
		    lastname = _ref14.lastname,
		    username = _ref14.username,
		    studentID = _ref14.studentID,
		    university = _ref14.university,
		    email = _ref14.email,
		    mobileNumber = _ref14.mobileNumber,
		    password = _ref14.password,
		    confirmPassword = _ref14.confirmPassword,
		    publicTransport = _ref14.publicTransport,
		    smartphone = _ref14.smartphone,
		    friends = _ref14.friends;

		var errors, regex, _regex, db, usernameCheck, emailCheck, newUser, salt, hash, newUserAuthentication;

		return regeneratorRuntime.wrap(function _callee13$(_context13) {
			while (1) {
				switch (_context13.prev = _context13.next) {
					case 0:
						if (!user) {
							_context13.next = 4;
							break;
						}

						return _context13.abrupt("return", new Error('User cannot be logged in'));

					case 4:
						// Validate parameters
						errors = [];


						if (!firstname) errors.push(new Error('First name is required'));

						if (!lastname) errors.push(new Error('Last name is required'));

						if (!username) errors.push(new Error('Username is required'));else if (username.length < 3) errors.push(new Error('Username must be longer than 3 characeters'));

						if (!email) errors.push(new Error('Email is required'));else {
							// Test email with regex
							regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

							if (!regex.test(email)) errors.push(new Error('Invalid email'));
						}

						if (!password) errors.push(new Error('Password is required'));else if (password.length < 6) errors.push(new Error('Password must be longer than 6 characeters'));

						if (!confirmPassword) errors.push(new Error('Confirm password is required'));else if (password !== confirmPassword) errors.push(new Error('Passwords do not match'));

						if (!studentID) errors.push(new Error('Student ID is required'));

						if (!university) errors.push(new Error('University is required'));

						if (!mobileNumber) errors.push(new Error('Mobile number is required'));else {
							_regex = /^([0-9 ]{10,15})$/;

							if (!_regex.test(mobileNumber)) errors.push(new Error('Invalid phone number'));
						}

						// Return errors if any were found

						if (!errors.length) {
							_context13.next = 16;
							break;
						}

						return _context13.abrupt("return", new Error(errors));

					case 16:
						_context13.next = 18;
						return (0, _connect2.default)();

					case 18:
						db = _context13.sent;
						_context13.next = 21;
						return db.collection('userauthentications').findOne({ username: username.toLowerCase() });

					case 21:
						usernameCheck = _context13.sent;

						if (!usernameCheck) {
							_context13.next = 24;
							break;
						}

						return _context13.abrupt("return", new Error('Username \'' + username + '\' already taken'));

					case 24:
						_context13.next = 26;
						return db.collection('userauthentications').findOne({ email: email.toLowerCase() });

					case 26:
						emailCheck = _context13.sent;

						if (!emailCheck) {
							_context13.next = 29;
							break;
						}

						return _context13.abrupt("return", new Error('Email \'' + email + '\' already taken'));

					case 29:

						// Create user
						newUser = {
							firstname: firstname,
							lastname: lastname,
							studentID: studentID,
							university: university,
							username: username.toLowerCase(),
							email: email.toLowerCase(),
							mobileNumber: mobileNumber,
							enabled: true,
							isAdmin: false,
							paid: false,
							raceDetails: {
								publicTransport: publicTransport, smartphone: smartphone, friends: friends
							},
							permissions: [],
							roles: [],
							registerDate: new Date()
						};

						// Create user account

						_context13.next = 32;
						return _bcryptjs2.default.genSalt(10);

					case 32:
						salt = _context13.sent;
						_context13.next = 35;
						return _bcryptjs2.default.hash(password, salt);

					case 35:
						hash = _context13.sent;
						newUserAuthentication = {
							username: username.toLowerCase(),
							email: email.toLowerCase(),
							password: hash
						};

						// Save user details

						_context13.next = 39;
						return db.collection('users').insert(newUser);

					case 39:
						_context13.next = 41;
						return db.collection('userauthentications').insert(newUserAuthentication);

					case 41:
						return _context13.abrupt("return", db.collection('users').findOne({ email: email.toLowerCase(), username: username.toLowerCase() }));

					case 42:
					case "end":
						return _context13.stop();
				}
			}
		}, _callee13, this);
	}));

	return function registerUser(_x34, _x35) {
		return _ref13.apply(this, arguments);
	};
}();

/**
 * Get the user's actions
 * @param {*} user
 * @param {String} action
 * @param {Number} skip
 * @param {Number} limit
 */
var getUserActions = function () {
	var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(user, action) {
		var skip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var findParams, escapedAction, actionRegex, db;
		return regeneratorRuntime.wrap(function _callee14$(_context14) {
			while (1) {
				switch (_context14.prev = _context14.next) {
					case 0:
						if (user) {
							_context14.next = 4;
							break;
						}

						return _context14.abrupt("return", new Error('No user logged in'));

					case 4:
						findParams = { who: user.username };

						if (!(limit < 0)) {
							_context14.next = 7;
							break;
						}

						return _context14.abrupt("return", new Error('Limit value must be non-negative, but received: ' + limit));

					case 7:

						if (action) {
							escapedAction = action.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
							actionRegex = new RegExp(['^', escapedAction, '$'].join(''), 'i');

							findParams.action = actionRegex;
						}

						_context14.next = 10;
						return (0, _connect2.default)();

					case 10:
						db = _context14.sent;
						return _context14.abrupt("return", db.collection('actions').find(findParams).sort({ date: -1 }).skip(skip).limit(limit).toArray());

					case 12:
					case "end":
						return _context14.stop();
				}
			}
		}, _callee14, this);
	}));

	return function getUserActions(_x36, _x37) {
		return _ref15.apply(this, arguments);
	};
}();

/**
 * Get actions
 * @param {*} user
 * @param {String} username
 * @param {String} action
 * @param {Number} skip
 * @param {Number} limit
 */
var getActions = function () {
	var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(user, username, action) {
		var skip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var authorized, findParams, escapedAction, actionRegex, db, userCheck;
		return regeneratorRuntime.wrap(function _callee15$(_context15) {
			while (1) {
				switch (_context15.prev = _context15.next) {
					case 0:
						if (user) {
							_context15.next = 4;
							break;
						}

						return _context15.abrupt("return", new Error('No user logged in'));

					case 4:
						_context15.next = 6;
						return _permission2.default.checkPermission(user, ['leader:view-useractions']);

					case 6:
						authorized = _context15.sent;

						if (!(authorized !== true)) {
							_context15.next = 9;
							break;
						}

						return _context15.abrupt("return", authorized);

					case 9:
						findParams = {};


						if (action) {
							escapedAction = action.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
							actionRegex = new RegExp(['^', escapedAction, '$'].join(''), 'i');

							findParams.action = actionRegex;
						}

						if (!(limit < 0)) {
							_context15.next = 13;
							break;
						}

						return _context15.abrupt("return", new Error('Limit value must be non-negative, but received: ' + limit));

					case 13:
						_context15.next = 15;
						return (0, _connect2.default)();

					case 15:
						db = _context15.sent;

						if (!username) {
							_context15.next = 25;
							break;
						}

						_context15.next = 19;
						return db.collection('users').findOne({ username: username });

					case 19:
						userCheck = _context15.sent;

						if (userCheck) {
							_context15.next = 24;
							break;
						}

						return _context15.abrupt("return", new Error('User \'' + username + '\' not found'));

					case 24:
						findParams.who = username;

					case 25:
						return _context15.abrupt("return", db.collection('actions').find(findParams).sort({ date: -1 }).skip(skip).limit(limit).toArray());

					case 26:
					case "end":
						return _context15.stop();
				}
			}
		}, _callee15, this);
	}));

	return function getActions(_x40, _x41, _x42) {
		return _ref16.apply(this, arguments);
	};
}();

/**
 * Set the enabled status of a user
 * @param {*} user
 * @param {String} username
 * @param {Boolean} enabled
 */
var setUserEnabled = function () {
	var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(user, username, enabled) {
		var authorized, db, userToModify, result, _action2;

		return regeneratorRuntime.wrap(function _callee16$(_context16) {
			while (1) {
				switch (_context16.prev = _context16.next) {
					case 0:
						if (user) {
							_context16.next = 4;
							break;
						}

						return _context16.abrupt("return", new Error('No user logged in'));

					case 4:
						_context16.next = 6;
						return _permission2.default.checkPermission(user, ['admin:modifypermission-user']);

					case 6:
						authorized = _context16.sent;

						if (!(authorized !== true)) {
							_context16.next = 9;
							break;
						}

						return _context16.abrupt("return", authorized);

					case 9:
						if (!(enabled !== true && enabled !== false)) {
							_context16.next = 13;
							break;
						}

						return _context16.abrupt("return", new Error('Invalid enabled argument'));

					case 13:
						_context16.next = 15;
						return (0, _connect2.default)();

					case 15:
						db = _context16.sent;
						_context16.next = 18;
						return db.collection('users').findOne({ username: username });

					case 18:
						userToModify = _context16.sent;

						if (userToModify) {
							_context16.next = 21;
							break;
						}

						return _context16.abrupt("return", new Error('User \'' + username + '\' not found'));

					case 21:
						if (!(enabled === userToModify.enabled)) {
							_context16.next = 23;
							break;
						}

						return _context16.abrupt("return", new Error('User already ' + (enabled ? 'enabled' : 'disabled')));

					case 23:

						if (!enabled) {
							// Revoke all refresh tokens
							db.collection('refreshtokens').update(
							// Selector
							{ email: user.email, valid: true },
							// Update
							{ $set: { valid: false, invalidatedOn: Date.now() } }, function (err, result) {
								console.log('Revoked ' + result.result.nModified + ' refresh token(s)');
							});
						}

						// Set the enabled status
						_context16.next = 26;
						return db.collection('users').update(
						// Selector
						{ username: username },
						// Update
						{ $set: { enabled: enabled } });

					case 26:
						result = _context16.sent;

						if (!(result.result.nModified === 1)) {
							_context16.next = 33;
							break;
						}

						// Log permission action
						_action2 = {
							action: enabled ? 'Enable user' : 'Disable user',
							target: username,
							targetCollection: 'users',
							date: new Date(),
							who: user.username
						};


						db.collection('actions').insert(_action2);

						return _context16.abrupt("return", {
							ok: true,
							action: _action2
						});

					case 33:
						return _context16.abrupt("return", new Error('Unable to modify user enabled status'));

					case 34:
					case "end":
						return _context16.stop();
				}
			}
		}, _callee16, this);
	}));

	return function setUserEnabled(_x45, _x46, _x47) {
		return _ref17.apply(this, arguments);
	};
}();

var setUserPaidAmount = function () {
	var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(user, username, amount) {
		var authorized, db, userToModify, result, _action3;

		return regeneratorRuntime.wrap(function _callee17$(_context17) {
			while (1) {
				switch (_context17.prev = _context17.next) {
					case 0:
						if (user) {
							_context17.next = 4;
							break;
						}

						return _context17.abrupt("return", new Error('No user logged in'));

					case 4:
						_context17.next = 6;
						return _permission2.default.checkPermission(user, ['admin:modifystatus-user']);

					case 6:
						authorized = _context17.sent;

						if (!(authorized !== true)) {
							_context17.next = 9;
							break;
						}

						return _context17.abrupt("return", authorized);

					case 9:
						if (!isNaN(parseFloat(amount))) {
							_context17.next = 13;
							break;
						}

						return _context17.abrupt("return", new Error('Invalid amount argument'));

					case 13:
						_context17.next = 15;
						return (0, _connect2.default)();

					case 15:
						db = _context17.sent;
						_context17.next = 18;
						return db.collection('users').findOne({ username: username });

					case 18:
						userToModify = _context17.sent;

						if (userToModify) {
							_context17.next = 21;
							break;
						}

						return _context17.abrupt("return", new Error('User \'' + username + '\' not found'));

					case 21:
						_context17.next = 23;
						return db.collection('users').update(
						// Selector
						{ username: username },
						// Update
						{ $set: { paidAmount: amount } });

					case 23:
						result = _context17.sent;

						if (!(result.result.nModified === 1)) {
							_context17.next = 30;
							break;
						}

						// Log permission action
						_action3 = {
							action: 'Set paid amount',
							target: username,
							targetCollection: 'users',
							date: new Date(),
							who: user.username
						};


						db.collection('actions').insert(_action3);

						return _context17.abrupt("return", {
							ok: true,
							action: _action3
						});

					case 30:
						return _context17.abrupt("return", new Error('Unable to modify user paid amount.'));

					case 31:
					case "end":
						return _context17.stop();
				}
			}
		}, _callee17, this);
	}));

	return function setUserPaidAmount(_x48, _x49, _x50) {
		return _ref18.apply(this, arguments);
	};
}();

exports.default = {
	getUserById: getUserById,
	getUserByUsername: getUserByUsername,
	getUserByEmail: getUserByEmail,
	getMe: getMe,
	checkUnique: checkUnique,
	listAll: listAll,
	checkUserPermission: checkUserPermission,
	addPermission: addPermission,
	removePermission: removePermission,
	addRole: addRole,
	removeRole: removeRole,
	registerUser: registerUser,
	getUserActions: getUserActions,
	getActions: getActions,
	setUserEnabled: setUserEnabled,
	setUserPaidAmount: setUserPaidAmount
};