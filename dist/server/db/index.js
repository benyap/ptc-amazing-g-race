'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The DB package is used to handle the connection to MongoDB
 * and all actions to be performed with the database. 
 */
exports.default = {
  connect: _connect2.default
};