'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _permission = require('./permission');

var _permission2 = _interopRequireDefault(_permission);

var _setting = require('./objects/setting');

var _setting2 = _interopRequireDefault(_setting);

var _user = require('./objects/user');

var _user2 = _interopRequireDefault(_user);

var _auth = require('./objects/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The DB package is used to handle the connection to MongoDB
 * and all actions to be performed with the database. 
 */
exports.default = {
	connect: _connect2.default,
	permission: _permission2.default,
	setting: _setting2.default,
	user: _user2.default,
	auth: _auth2.default
};