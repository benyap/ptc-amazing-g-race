require("babel-core/register");
require("babel-polyfill");

import jwt from 'jsonwebtoken';


/**
 * Authentication middleware. 
 * Popualates req.user with the user object if authentication is valid.
 */
const authentication = async function(req, res, next) {
	// Get access token
	const access = _getBearer(req, 'authorization');

	try {
		// Verify access token
		let payload = await jwt.verify(access, process.env.JWT_SECRET);

		// Set req.user to user details
		if (payload) {
			req.user = payload;
		}

		next();
	}
	catch (e) { 
		// Token error
		next();
	}
}

/**
 * Get the value of a header with the name headername of the type 'Bearer'
 * @param {String} headername 
 * @param {*} req 
 */
const _getBearer = function(req, headername) {
	if (req.headers[headername]) {
		let header = req.headers[headername].split(' ');
		if (header[0] === 'Bearer') {
			return header[1];
		}
	}
}


export default authentication;
