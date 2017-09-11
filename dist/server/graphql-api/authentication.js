"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");

/**
 * Authentication middleware. 
 * Popualates req.user with the user object if authentication is valid.
 */
var authentication = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
		var access, payload;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						// Get access token
						access = _getBearer(req, 'authorization');
						_context.prev = 1;
						_context.next = 4;
						return _jsonwebtoken2.default.verify(access, process.env.JWT_SECRET);

					case 4:
						payload = _context.sent;


						// Set req.user to user details
						if (payload) {
							req.user = payload;
						}

						next();
						_context.next = 12;
						break;

					case 9:
						_context.prev = 9;
						_context.t0 = _context["catch"](1);

						// Token error
						next();

					case 12:
					case "end":
						return _context.stop();
				}
			}
		}, _callee, this, [[1, 9]]);
	}));

	return function authentication(_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}();

/**
 * Get the value of a header with the name headername of the type 'Bearer'
 * @param {String} headername 
 * @param {*} req 
 */
var _getBearer = function _getBearer(req, headername) {
	if (req.headers[headername]) {
		var header = req.headers[headername].split(' ');
		if (header[0] === 'Bearer') {
			return header[1];
		}
	}
};

exports.default = authentication;