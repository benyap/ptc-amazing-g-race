require("babel-core/register");
require("babel-polyfill");

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import db from './db';


// ====================
//  CREATE EXPRESS APP
// ====================

// Set up dotenv to read environment variables
require('dotenv').config();

console.log('\n** STARTING SERVER **');
console.log('NODE_ENV: ' + process.env.NODE_ENV);

// Create express app
const app = express();


// ============
//  MIDDLEWARE
// ============

//Connect to MongoDB
db.connect();

// Use morgan to log requests to console
if (process.env.NODE_ENV === 'development') {
	console.log('Using morgan.');
	app.use(morgan('dev'));
}

// Busboy body parser middleware
let busboyBodyParser = require('busboy-body-parser');
app.use(busboyBodyParser());

// Allow CORS
app.use(cors());


// =========
//	ROUTING
// =========
app.all('*', (req, res) => {
	res.send('Hello World!');
});


// ==========
//	SERVER
// ==========
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log("\nServer started on port " + PORT + "... \n");
});
