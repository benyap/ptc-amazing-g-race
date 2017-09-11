'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _types = require('../types');

var _types2 = _interopRequireDefault(_types);

var _settingQuery = require('./settingQuery');

var _settingQuery2 = _interopRequireDefault(_settingQuery);

var _userQuery = require('./userQuery');

var _userQuery2 = _interopRequireDefault(_userQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({
	test: {
		type: _types2.default.confirmType,
		description: 'Test access to GraphQL endpoint',
		resolve: function resolve() {
			return { ok: true };
		}
	}
}, _settingQuery2.default, _userQuery2.default);