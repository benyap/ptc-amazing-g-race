'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _db = require('../../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getUserById = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						return _context.abrupt('return', _db2.default.user.getUserById(ctx.user, params.userId));

					case 1:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function getUserById(_x, _x2, _x3, _x4) {
		return _ref.apply(this, arguments);
	};
}();

var getUserByUsername = function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						return _context2.abrupt('return', _db2.default.user.getUserByUsername(ctx.user, params.username));

					case 1:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getUserByUsername(_x5, _x6, _x7, _x8) {
		return _ref2.apply(this, arguments);
	};
}();

var getUserByEmail = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						return _context3.abrupt('return', _db2.default.user.getUserByEmail(ctx.user, params.email));

					case 1:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function getUserByEmail(_x9, _x10, _x11, _x12) {
		return _ref3.apply(this, arguments);
	};
}();

var getMe = function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						return _context4.abrupt('return', _db2.default.user.getMe(ctx.user));

					case 1:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, this);
	}));

	return function getMe(_x13, _x14, _x15, _x16) {
		return _ref4.apply(this, arguments);
	};
}();

var checkUnique = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						return _context5.abrupt('return', _db2.default.user.checkUnique(ctx.user, params.parameter, params.value));

					case 1:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, this);
	}));

	return function checkUnique(_x17, _x18, _x19, _x20) {
		return _ref5.apply(this, arguments);
	};
}();

var listAll = function () {
	var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee6$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						return _context6.abrupt('return', _db2.default.user.listAll(ctx.user, params.skip, params.limit));

					case 1:
					case 'end':
						return _context6.stop();
				}
			}
		}, _callee6, this);
	}));

	return function listAll(_x21, _x22, _x23, _x24) {
		return _ref6.apply(this, arguments);
	};
}();

var checkUserPermission = function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						return _context7.abrupt('return', _db2.default.user.checkUserPermission(ctx.user, params.username, params.permission));

					case 1:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, this);
	}));

	return function checkUserPermission(_x25, _x26, _x27, _x28) {
		return _ref7.apply(this, arguments);
	};
}();

var addPermission = function () {
	var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee8$(_context8) {
			while (1) {
				switch (_context8.prev = _context8.next) {
					case 0:
						return _context8.abrupt('return', _db2.default.user.addPermission(ctx.user, params.username, params.permission));

					case 1:
					case 'end':
						return _context8.stop();
				}
			}
		}, _callee8, this);
	}));

	return function addPermission(_x29, _x30, _x31, _x32) {
		return _ref8.apply(this, arguments);
	};
}();

var removePermission = function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						return _context9.abrupt('return', _db2.default.user.removePermission(ctx.user, params.username, params.permission));

					case 1:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, this);
	}));

	return function removePermission(_x33, _x34, _x35, _x36) {
		return _ref9.apply(this, arguments);
	};
}();

var addRole = function () {
	var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee10$(_context10) {
			while (1) {
				switch (_context10.prev = _context10.next) {
					case 0:
						return _context10.abrupt('return', _db2.default.user.addRole(ctx.user, params.username, params.role));

					case 1:
					case 'end':
						return _context10.stop();
				}
			}
		}, _callee10, this);
	}));

	return function addRole(_x37, _x38, _x39, _x40) {
		return _ref10.apply(this, arguments);
	};
}();

var removeRole = function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						return _context11.abrupt('return', _db2.default.user.removeRole(ctx.user, params.username, params.role));

					case 1:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, this);
	}));

	return function removeRole(_x41, _x42, _x43, _x44) {
		return _ref11.apply(this, arguments);
	};
}();

var registerUser = function () {
	var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						return _context12.abrupt('return', _db2.default.user.registerUser(ctx.user, {
							firstname: params.firstname,
							lastname: params.lastname,
							username: params.username,
							studentID: params.studentID,
							university: params.university,
							email: params.email,
							mobileNumber: params.mobileNumber,
							password: params.password,
							confirmPassword: params.confirmPassword,
							publicTransport: params.publicTransport,
							smartphone: params.smartphone,
							friends: params.friends
						}));

					case 1:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, this);
	}));

	return function registerUser(_x45, _x46, _x47, _x48) {
		return _ref12.apply(this, arguments);
	};
}();

// Get this user's actions
var getUserActions = function () {
	var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee13$(_context13) {
			while (1) {
				switch (_context13.prev = _context13.next) {
					case 0:
						return _context13.abrupt('return', _db2.default.user.getUserActions(ctx.user, params.action, params.skip, params.limit));

					case 1:
					case 'end':
						return _context13.stop();
				}
			}
		}, _callee13, this);
	}));

	return function getUserActions(_x49, _x50, _x51, _x52) {
		return _ref13.apply(this, arguments);
	};
}();

// Get actions
var getActions = function () {
	var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee14$(_context14) {
			while (1) {
				switch (_context14.prev = _context14.next) {
					case 0:
						return _context14.abrupt('return', _db2.default.user.getActions(ctx.user, params.username, params.action, params.skip, params.limit));

					case 1:
					case 'end':
						return _context14.stop();
				}
			}
		}, _callee14, this);
	}));

	return function getActions(_x53, _x54, _x55, _x56) {
		return _ref14.apply(this, arguments);
	};
}();

var setUserEnabled = function () {
	var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee15$(_context15) {
			while (1) {
				switch (_context15.prev = _context15.next) {
					case 0:
						return _context15.abrupt('return', _db2.default.user.setUserEnabled(ctx.user, params.username, params.enabled));

					case 1:
					case 'end':
						return _context15.stop();
				}
			}
		}, _callee15, this);
	}));

	return function setUserEnabled(_x57, _x58, _x59, _x60) {
		return _ref15.apply(this, arguments);
	};
}();

var setUserPaidAmount = function () {
	var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(root, params, ctx, options) {
		return regeneratorRuntime.wrap(function _callee16$(_context16) {
			while (1) {
				switch (_context16.prev = _context16.next) {
					case 0:
						return _context16.abrupt('return', _db2.default.user.setUserPaidAmount(ctx.user, params.username, params.amount));

					case 1:
					case 'end':
						return _context16.stop();
				}
			}
		}, _callee16, this);
	}));

	return function setUserPaidAmount(_x61, _x62, _x63, _x64) {
		return _ref16.apply(this, arguments);
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