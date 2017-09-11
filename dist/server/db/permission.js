"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _connect = require("./connect");

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");

var OVERRIDE = 'owner:override';

/**
 * Check if a user has a required permission.
 * Returns true if the user has the permission,
 * returns an error otherwise.
 * @param {*} user 
 * @param {*} required 
 */
var checkPermission = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user, required) {
		var db, userInfo, i;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context.sent;
						_context.next = 5;
						return db.collection('users').findOne({ username: user.username });

					case 5:
						userInfo = _context.sent;
						i = 0;

					case 7:
						if (!(i < required.length)) {
							_context.next = 14;
							break;
						}

						if (!(userInfo.permissions.indexOf(required[i]) < 0)) {
							_context.next = 11;
							break;
						}

						if (!(required[i] !== OVERRIDE)) {
							_context.next = 11;
							break;
						}

						return _context.abrupt("return", new Error('Permission denied: <' + required[i] + '> required.'));

					case 11:
						i++;
						_context.next = 7;
						break;

					case 14:
						return _context.abrupt("return", true);

					case 15:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function checkPermission(_x, _x2) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * Check if a user has one of the accepted roles.
 * Returns true if the intersection of the user's roles and the required roles is greater than 1,
 * returns an error otherwise.
 * @param {*} user
 * @param {*} accepted
 */
var checkRole = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user, accepted) {
		var db, userInfo, intersection;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _connect2.default)();

					case 2:
						db = _context2.sent;
						_context2.next = 5;
						return db.collection('users').findOne({ username: user.username });

					case 5:
						userInfo = _context2.sent;

						if (!(accepted.length > 0)) {
							_context2.next = 10;
							break;
						}

						intersection = accepted.filter(function (value) {
							return userInfo.roles.indexOf(value) > -1;
						});

						if (!(intersection.length < 1)) {
							_context2.next = 10;
							break;
						}

						return _context2.abrupt("return", new Error('User does not have the correct role access to modify this setting. Accepted roles: ' + accepted));

					case 10:
						return _context2.abrupt("return", true);

					case 11:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function checkRole(_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}();

exports.default = {
	checkPermission: checkPermission,
	checkRole: checkRole
};