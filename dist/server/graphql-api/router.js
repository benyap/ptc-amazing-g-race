'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _graphql = require('./graphql');

var _graphql2 = _interopRequireDefault(_graphql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Use authentication middleware
router.use(_authentication2.default);

router.use('/graphql', _graphql2.default);

exports.default = router;