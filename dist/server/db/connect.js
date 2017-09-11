'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

/**
 * The connection object
 */
var _connection = void 0;

/**
 * The URI to connect to MongoDB 
 */
var uri = 'mongodb://' + process.env.MONGO_ADMIN_USER + ':' + process.env.MONGO_ADMIN_KEY + '@cluster0-shard-00-00-qp62y.mongodb.net:27017,cluster0-shard-00-01-qp62y.mongodb.net:27017,cluster0-shard-00-02-qp62y.mongodb.net:27017/' + process.env.MONGO_DB + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

/**
 * Returns a promise that resolves when a connection with MongoDB is established.
 */
var connect = function connect() {
	return new Promise(function (resolve, reject) {
		// Connect to MongoDB
		_mongodb2.default.MongoClient().connect(uri, function (err, db) {
			if (err || !db) {
				console.log(err);
				console.log('\nAn error occurred when trying to connect to MongoDB.');
				reject(err);
			} else {
				console.log('Connected to MongoDB.');
				resolve(db);
			}
		});
	});
};

/**
 * Retrieves the connection with MongoDB.
 * If the connection is not already established,
 * it will attempt to create a connection.
 */
var connection = function connection() {
	if (!_connection) {
		_connection = connect();
	}
	return _connection;
};

exports.default = connection;