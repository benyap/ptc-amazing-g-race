'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _settingMutation = require('./settingMutation');

var _settingMutation2 = _interopRequireDefault(_settingMutation);

var _userMutation = require('./userMutation');

var _userMutation2 = _interopRequireDefault(_userMutation);

var _authMutation = require('./authMutation');

var _authMutation2 = _interopRequireDefault(_authMutation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({}, _settingMutation2.default, _userMutation2.default, _authMutation2.default);