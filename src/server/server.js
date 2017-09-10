require("babel-core/register");
require("babel-polyfill");

import path from 'path';
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

// Serve static files
app.use(express.static('public'));

// Allow CORS
app.use(cors());


// =========
//	ROUTING
// =========

// Route to API
// app.use('/api', grpahqlapi.router);
app.use('/api', (req, res) => {
	res.send('API');
});

// Return the admin page
app.use('/admin', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'admin.html'));
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});


// ==========
//	SERVER
// ==========
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log("\nServer started on port " + PORT + "... \n");
});
