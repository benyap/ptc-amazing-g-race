"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _db = require("./db");

var _db2 = _interopRequireDefault(_db);

var _graphqlApi = require("./graphql-api");

var _graphqlApi2 = _interopRequireDefault(_graphqlApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-core/register");
require("babel-polyfill");

// ====================
//  CREATE EXPRESS APP
// ====================

// Set up dotenv to read environment variables
require('dotenv').config();

console.log('\n** STARTING SERVER **');
console.log('NODE_ENV: ' + process.env.NODE_ENV);

// Create express app
var app = (0, _express2.default)();

// ============
//  MIDDLEWARE
// ============

//Connect to MongoDB
_db2.default.connect();

// Use morgan to log requests to console
if (process.env.NODE_ENV === 'development') {
	console.log('Using morgan.');
	app.use((0, _morgan2.default)('dev'));
}

// Busboy body parser middleware
var busboyBodyParser = require('busboy-body-parser');
app.use(busboyBodyParser());

// Serve static files
app.use(_express2.default.static('public'));

// Allow CORS
app.use((0, _cors2.default)());

// =========
//	ROUTING
// =========

// Route to API
app.use('/api', _graphqlApi2.default.router);

// Return the admin page
app.use('/admin', function (req, res) {
	res.sendFile(_path2.default.resolve(__dirname, '..', '..', 'public', 'admin.html'));
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', function (req, res) {
	res.sendFile(_path2.default.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

// ==========
//	SERVER
// ==========
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
	console.log("\nServer started on port " + PORT + "... \n");
});