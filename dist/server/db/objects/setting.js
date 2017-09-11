"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

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
 * Get a setting value
 * @param {*} user 
 * @param {String} key
 */
var getSetting = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, key) {
		var authorized, db, setting;
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
						return _permission2.default.checkPermission(user, ['admin:view-setting']);

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
						_context.next = 14;
						return db.collection('settings').findOne({ key: key });

					case 14:
						setting = _context.sent;

						if (setting) {
							_context.next = 17;
							break;
						}

						return _context.abrupt("return", new Error('Setting not found'));

					case 17:
						return _context.abrupt("return", setting);

					case 18:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function getSetting(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * Get a setting value
 * @param {*} user 
 * @param {String} key
 */
var getPublicSetting = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(key) {
		var db, setting;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context2.sent;
						_context2.next = 5;
						return db.collection('settings').findOne({ key: key, public: true });

					case 5:
						setting = _context2.sent;

						if (setting) {
							_context2.next = 8;
							break;
						}

						return _context2.abrupt("return", new Error('Setting not found'));

					case 8:
						return _context2.abrupt("return", setting);

					case 9:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getPublicSetting(_x3) {
		return _ref2.apply(this, arguments);
	};
}();

/**
 * Get list of settings
 * @param {*} user 
 * @param {Number} skip
 * @param {Number} skip
 */
var getSettings = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(user) {
		var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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
						return _permission2.default.checkPermission(user, ['admin:view-setting']);

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
						return _context3.abrupt("return", db.collection('settings').find({}).skip(skip).limit(limit).toArray());

					case 13:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function getSettings(_x4) {
		return _ref3.apply(this, arguments);
	};
}();

/**
 * Set the value of a setting
 * @param {*} user 
 * @param {String} key
 * @param {String} value
 */
var setSetting = function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(user, key, value) {
		var authorized, db, setting, hasRole, result, action;
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
						return _permission2.default.checkPermission(user, ['admin:modify-setting']);

					case 6:
						authorized = _context4.sent;

						if (!(authorized !== true)) {
							_context4.next = 9;
							break;
						}

						return _context4.abrupt("return", authorized);

					case 9:
						_context4.next = 11;
						return (0, _connect2.default)();

					case 11:
						db = _context4.sent;
						_context4.next = 14;
						return db.collection('settings').findOne({ key: key });

					case 14:
						setting = _context4.sent;

						if (setting) {
							_context4.next = 17;
							break;
						}

						return _context4.abrupt("return", new Error('Setting not found'));

					case 17:
						if (setting.value) {
							_context4.next = 19;
							break;
						}

						return _context4.abrupt("return", new Error('Cannot set the value of a multi-value setting'));

					case 19:
						_context4.next = 21;
						return _permission2.default.checkRole(user, setting.modifiableRoles);

					case 21:
						hasRole = _context4.sent;

						if (!(hasRole !== true)) {
							_context4.next = 24;
							break;
						}

						return _context4.abrupt("return", hasRole);

					case 24:
						_context4.t0 = setting.valueType;
						_context4.next = _context4.t0 === 'string' ? 27 : _context4.t0 === 'integer' ? 28 : 32;
						break;

					case 27:
						return _context4.abrupt("break", 32);

					case 28:
						value = parseInt(value);

						if (!isNaN(value)) {
							_context4.next = 31;
							break;
						}

						return _context4.abrupt("return", new Error('Invalid value passed for setting of type integer'));

					case 31:
						return _context4.abrupt("break", 32);

					case 32:
						if (!(setting.value === value)) {
							_context4.next = 34;
							break;
						}

						return _context4.abrupt("return", new Error('Setting \'' + key + '\' already has that value'));

					case 34:
						_context4.next = 36;
						return db.collection('settings').update(
						// Selector
						{ key: key },
						// Update
						{
							$set: {
								value: value,
								modified: new Date(),
								modifiedBy: user.username
							}
						});

					case 36:
						result = _context4.sent;

						if (!(result.result.nModified === 1)) {
							_context4.next = 43;
							break;
						}

						// Log action
						action = {
							action: 'Modify setting',
							target: key,
							targetCollection: 'settings',
							who: user.username,
							date: new Date(),
							infoJSONString: JSON.stringify({
								action: 'set',
								value: value
							})
						};

						db.collection('actions').insert(action);

						return _context4.abrupt("return", {
							ok: true,
							action: action
						});

					case 43:
						return _context4.abrupt("return", new Error('Unable to modify setting \'' + key + '\''));

					case 44:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee4, this);
	}));

	return function setSetting(_x7, _x8, _x9) {
		return _ref4.apply(this, arguments);
	};
}();

/**
 * Add a value to a setting
 * @param {*} user 
 * @param {String} key
 * @param {String} value
 */
var addSetting = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user, key, value) {
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						return _context5.abrupt("return", _modifySettingList('add', user, key, value));

					case 1:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee5, this);
	}));

	return function addSetting(_x10, _x11, _x12) {
		return _ref5.apply(this, arguments);
	};
}();

/**
 * Remove a value from a setting
 * @param {*} user 
 * @param {String} key
 * @param {String} value
 */
var removeSetting = function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(user, key, value) {
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						return _context6.abrupt("return", _modifySettingList('remove', user, key, value));

					case 1:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee6, this);
	}));

	return function removeSetting(_x13, _x14, _x15) {
		return _ref6.apply(this, arguments);
	};
}();

var _modifySettingList = function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(modifyAction, user, key, value) {
		var errorString, modification, _db$collection$update, authorized, db, setting, hasRole, result, action;

		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						errorString = void 0;
						modification = void 0;

						if (!(modifyAction === 'add')) {
							_context7.next = 7;
							break;
						}

						errorString = 'add a value to';
						modification = '$push';
						_context7.next = 13;
						break;

					case 7:
						if (!(modifyAction === 'remove')) {
							_context7.next = 12;
							break;
						}

						errorString = 'remove a value from';
						modification = '$pull';
						_context7.next = 13;
						break;

					case 12:
						throw new Error('Invalid modify setting list argument action: ' + modifyAction);

					case 13:
						if (user) {
							_context7.next = 17;
							break;
						}

						return _context7.abrupt("return", new Error('No user logged in'));

					case 17:
						_context7.next = 19;
						return _permission2.default.checkPermission(user, ['admin:modify-setting']);

					case 19:
						authorized = _context7.sent;

						if (!(authorized !== true)) {
							_context7.next = 22;
							break;
						}

						return _context7.abrupt("return", authorized);

					case 22:
						_context7.next = 24;
						return (0, _connect2.default)();

					case 24:
						db = _context7.sent;
						_context7.next = 27;
						return db.collection('settings').findOne({ key: key });

					case 27:
						setting = _context7.sent;

						if (setting) {
							_context7.next = 30;
							break;
						}

						return _context7.abrupt("return", new Error('Setting \'' + key + '\' not found'));

					case 30:
						if (setting.values) {
							_context7.next = 32;
							break;
						}

						return _context7.abrupt("return", new Error('Cannot ' + errorString + ' a single-value setting'));

					case 32:
						_context7.next = 34;
						return _permission2.default.checkRole(user, setting.modifiableRoles);

					case 34:
						hasRole = _context7.sent;

						if (!(hasRole !== true)) {
							_context7.next = 37;
							break;
						}

						return _context7.abrupt("return", hasRole);

					case 37:
						_context7.t0 = setting.valueType;
						_context7.next = _context7.t0 === 'stringList' ? 40 : _context7.t0 === 'integerList' ? 41 : 45;
						break;

					case 40:
						return _context7.abrupt("break", 45);

					case 41:
						value = parseInt(value);

						if (!isNaN(value)) {
							_context7.next = 44;
							break;
						}

						return _context7.abrupt("return", new Error('Invalid value passed for setting of type integer'));

					case 44:
						return _context7.abrupt("break", 45);

					case 45:
						if (!(modifyAction === 'add')) {
							_context7.next = 50;
							break;
						}

						if (!(setting.values.indexOf(value) >= 0)) {
							_context7.next = 48;
							break;
						}

						return _context7.abrupt("return", new Error('Value \'' + value + '\' already exists in setting'));

					case 48:
						_context7.next = 53;
						break;

					case 50:
						if (!(modifyAction === 'remove')) {
							_context7.next = 53;
							break;
						}

						if (!(setting.values.indexOf(value) < 0)) {
							_context7.next = 53;
							break;
						}

						return _context7.abrupt("return", new Error('Value \'' + value + '\' does not exist in setting'));

					case 53:
						_context7.next = 55;
						return db.collection('settings').update(
						// Selector
						{ key: key }, (_db$collection$update = {}, _defineProperty(_db$collection$update, modification, {
							values: value
						}), _defineProperty(_db$collection$update, "$set", {
							modified: new Date(),
							modifiedBy: user.username
						}), _db$collection$update));

					case 55:
						result = _context7.sent;

						if (!(result.result.nModified === 1)) {
							_context7.next = 62;
							break;
						}

						// Log action
						action = {
							action: 'Modify setting',
							target: key,
							targetCollection: 'settings',
							who: user.username,
							date: new Date(),
							infoJSONString: JSON.stringify({
								action: modifyAction,
								value: value
							})
						};

						db.collection('actions').insert(action);

						return _context7.abrupt("return", {
							ok: true,
							action: action
						});

					case 62:
						return _context7.abrupt("return", new Error('Unable to modify setting \'' + key + '\''));

					case 63:
					case "end":
						return _context7.stop();
				}
			}
		}, _callee7, this);
	}));

	return function _modifySettingList(_x16, _x17, _x18, _x19) {
		return _ref7.apply(this, arguments);
	};
}();

exports.default = {
	getSetting: getSetting,
	getPublicSetting: getPublicSetting,
	getSettings: getSettings,
	setSetting: setSetting,
	addSetting: addSetting,
	removeSetting: removeSetting
};