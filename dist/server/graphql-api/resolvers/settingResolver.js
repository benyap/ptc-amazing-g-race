'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _db = require('../../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getSetting = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						return _context.abrupt('return', _db2.default.setting.getSetting(ctx.user, params.key));

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function getSetting(_x, _x2, _x3, _x4) {
		return _ref.apply(this, arguments);
	};
}();

var getPublicSetting = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						return _context2.abrupt('return', _db2.default.setting.getPublicSetting(params.key));

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getPublicSetting(_x5, _x6, _x7, _x8) {
		return _ref2.apply(this, arguments);
	};
}();

var getSettings = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						return _context3.abrupt('return', _db2.default.setting.getSettings(ctx.user, params.skip, params.limit));

					case 1:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function getSettings(_x9, _x10, _x11, _x12) {
		return _ref3.apply(this, arguments);
	};
}();

var setSetting = function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						return _context4.abrupt('return', _db2.default.setting.setSetting(ctx.user, params.key, params.value));

					case 1:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, this);
	}));

	return function setSetting(_x13, _x14, _x15, _x16) {
		return _ref4.apply(this, arguments);
	};
}();

var addSetting = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						return _context5.abrupt('return', _db2.default.setting.addSetting(ctx.user, params.key, params.value));

					case 1:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, this);
	}));

	return function addSetting(_x17, _x18, _x19, _x20) {
		return _ref5.apply(this, arguments);
	};
}();

var removeSetting = function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						return _context6.abrupt('return', _db2.default.setting.removeSetting(ctx.user, params.key, params.value));

					case 1:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, this);
	}));

	return function removeSetting(_x21, _x22, _x23, _x24) {
		return _ref6.apply(this, arguments);
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