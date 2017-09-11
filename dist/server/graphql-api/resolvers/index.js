'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _settingResolver = require('./settingResolver');

var _settingResolver2 = _interopRequireDefault(_settingResolver);

var _userResolver = require('./userResolver');

var _userResolver2 = _interopRequireDefault(_userResolver);

var _authResolver = require('./authResolver');

var _authResolver2 = _interopRequireDefault(_authResolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	settingResolver: _settingResolver2.default,
	userResolver: _userResolver2.default,
	authResolver: _authResolver2.default
};