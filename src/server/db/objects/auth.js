require("babel-core/register");
require("babel-polyfill");

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connect from '../connect';
import permission from '../permission';


const login = function(user, email, password) {
	return _login(user, email, password, false);
}

const adminLogin = function(user, email, password) {
	return _login(user, email, password, true);
}

/**
 * Create JWT tokens for a user if correct credentials are provided.
 * @param {*} user 
 * @param {String} email 
 * @param {String} password 
 */
const _login = async function(user, email, password, isAdmin) {
	if (user) {
		return new Error('Already logged in');
	}

	email = email.toLowerCase();
	
	// Connect to MongoDB and verify authentication
	const db = await connect();
	let userauthentication;
	if (isAdmin) {
		userauthentication = await db.collection('userauthentications').findOne({email, isAdmin});
	}
	else {
		userauthentication = await db.collection('userauthentications').findOne({email});
	}

	let response;

	if (!userauthentication) {
		response = {
			ok: false,
			message: 'User not found',
			email: email
		};
	}
	else {
		const isMatch = await bcrypt.compare(password, userauthentication.password);
	
		if (!isMatch) {
			response = {
				ok: false,
				message: 'Invalid credentials',
				email: email
			};
		}
		else {
			// Retrieve user
			const retrievedUser = await db.collection('users').findOne({email});
		
			// Check that the user is enabled
			if (!retrievedUser.enabled) {
				response = {
					ok: false,
					message: 'User is not enabled',
					email: email
				};
			}
			else {
				// Generate tokens
				const access_token = _generateAccessToken(retrievedUser);
				const refresh_token = _generateRefreshToken(retrievedUser);
		
				const action = {
					action: 'Log in successful',
					target: isAdmin ? 'admin' : 'user',
					targetCollection: 'refreshtokens',
					date: new Date(),
					who: retrievedUser.username
				}

				// Removed successful login logging to reduce log clutter
				// db.collection('actions').insert(action);
		
				return {
					ok: true,
					message: 'Log in successful',
					email: retrievedUser.email,
					userId: retrievedUser._id,
					username: retrievedUser.username,
					access_token: access_token,
					refresh_token: refresh_token
				};
			}
		}
	}

	// Log failed login attempt
	const action = {
		action: 'Log in failed',
		target: isAdmin ? 'admin' : 'user',
		targetCollection: 'none',
		date: new Date(),
		who: email,
		infoJSONString: JSON.stringify({reason: response.message})
	}
	db.collection('actions').insert(action);

	return response;
}


/**
 * Verify a refresh token and generate a new access token if valid
 * @param {*} user 
 * @param {String} refreshToken 
 */
const refresh = async function(user, refreshToken) {
	const db = await connect();
	
	// Clear all expired tokens
	const result = await db.collection('refreshtokens').remove({expiry: {$lt: Date.now()/1000}});
	if (result.result.n > 0) console.log(`Removed ${result.result.n} expired refresh token(s)`);

	try {
		// Verify refresh token
		const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

		// Refresh token valid
		if (payload) {
			const token = await db.collection('refreshtokens').findOne({token: refreshToken});
			
			if (!token) {
				// Refresh token not found, invalidate all tokens by user
				db.collection('refreshtokens').update(
					// Selector
					{ email: payload.email },
					// Update
					{ $set: { valid: false, invalidatedOn: Date.now() } },
					// Options
					{ multi: true }
				);
				return {
					ok: false,
					message: 'Invalid refresh token: does not exist'
				}
			}
			else {
				// Refresh token found
				// Check if token valid
				if (!token.valid) {
					return {
						ok: false,
						message: 'Token invalidated',
						email: payload.email
					};
				}
				else {
					// Retrieve user
					const userTokenOwner = await db.collection('users').findOne({email: payload.email});

					// Check that the user is enabled
					if (!userTokenOwner.enabled) {
						return {
							ok: false,
							message: 'User is not enabled',
							email: userTokenOwner.email
						};
					}
					else {
						// Update number of uses
						db.collection('refreshtokens').update(
							// Selector
							{ token: refreshToken },
							// Update
							{ $push: { uses: Date.now() } }
						);

						// Generate new access token
						const access_token = _generateAccessToken(userTokenOwner);
						
						return {
							ok: true,
							message: 'Access token refreshed',
							userId: userTokenOwner._id,
							username: userTokenOwner.username,
							email: userTokenOwner.email,
							access_token: access_token,
							refresh_token: refreshToken
						};
					}
				}
			}
		}
		else {
			return {
				ok: false,
				message: 'Invalid refresh token: no payload'
			}
		}
	}
	catch (e) { 
		if (e.name === 'TokenExpiredError') {
			return {
				ok: false,
				message: 'Token expired'
			};
		}
		else {
			return {
				ok: false,
				message: e.toString()
			};
		}
	}
};


/**
 * Generate an access token for the given user.
 */
const _generateAccessToken = async function(user) {
	const db = await connect();
	const JWT_ACCESS_EXPIRY_raw = await db.collection('settings').findOne({key: 'auth_jwt_access_expiry'});
	const JWT_ACCESS_EXPIRY = JWT_ACCESS_EXPIRY_raw.value;

	return _generateToken(user, JWT_ACCESS_EXPIRY);
}


/**
 * Generate a refresh token for the given user.
 */
const _generateRefreshToken = async function(user) {
	const db = await connect();
	const JWT_REFRESH_EXPIRY_raw = await db.collection('settings').findOne({key: 'auth_jwt_refresh_expiry'});
	const JWT_REFRESH_EXPIRY = JWT_REFRESH_EXPIRY_raw.value;
	
	const token = _generateToken(user, JWT_REFRESH_EXPIRY);

	const decoded = await jwt.decode(token);
	
	// Keep a record of the generated refresh token
	// This will be black listed if the user logs out
	const refresh = {
		email: user.email,
		valid: true,
		token: token,
		expiry: decoded.exp,
		created: new Date(),
		uses: []
	}
	
	// Add refresh token to db
	db.collection('refreshtokens').insert(refresh);

	return token;
}


/**
 * Generate a token for the given user,
 * with the speciifed expiry time in seconds.
 * @param {*} user 
 * @param {number} expiresIn
 */
const _generateToken = function(user, expiresIn) {
	// Payload data for the token
	const payload = {
		userId: user._id.toString(),
		username: user.username,
		email: user.email
	};
	
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}


/**
 * Logout a user by revoking their refresh token.
 * Access token should be removed by the client.
 * @param {*} user 
 * @param {String} refreshToken 
 */
const logout = async function(user, refreshToken) {
	const db = await connect();
	let response;

	try {
		// Verify refresh token
		const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

		if (payload) {
			// Invalidate token
			const result = await db.collection('refreshtokens').update(
				// Selector
				{ email: user ? user.email : payload.email, token: refreshToken, valid: true },
				// Update
				{ $set: { valid: false, invalidatedOn: Date.now() } }
			);

			if (result.result.n === 1) {
				// Logout successful
				if (result.result.nModified === 1) {
					response = { ok: true };
				}
				else {
					response = {
						ok: false,
						failureMessage: 'Token already invalidated'
					};
				}
			}
			else {
				response = {
					ok: false,
					failureMessage: 'No token invalidated'
				};
			}
		}
		else {
			response = {
				ok: false,
				failureMessage: 'Invalid payload'
			}
		}
	}
	catch (e) {
		response = {
			ok: false,
			failureMessage: 'Invalid refresh token'
		};
	}

	const action = {
		action: 'Logged out',
		target: user ? user.username : 'Invalid access token',
		targetCollection: 'refreshtokens',
		date: new Date(),
		who: user ? user.username : 'Invalid access token',
		infoJSONString: JSON.stringify({message: response.failureMessage})
	}
	// Removed logout logging to reduce log clutter
	// db.collection('actions').insert(action);

	return response;
}


/**
 * Change a user's password. Their current password must be provided.
 * @param {*} user 
 * @param {String} currentPassword 
 * @param {String} newPassword 
 * @param {String} confirmPassword 
 */
const changePassword = async function(user, currentPassword, newPassword, confirmPassword) {
	if (!user) {
		return new Error('Not logged in');
	}

	const db = await connect();
	const userauthentication = await db.collection('userauthentications').findOne({email: user.email});
	
	if (!userauthentication) return new Error('User not found');

	const isMatch = await bcrypt.compare(currentPassword, userauthentication.password);
	
	if (!isMatch) {
		return {
			ok: false,
			failureMessage: 'Invalid credentials'
		};
	}

	// Password validation
	
	// Verify length
	const minLength_raw = await db.collection('settings').findOne({key:'auth_password_min_length'});
	const minLength = minLength_raw.value;

	if (currentPassword.length < minLength) {
		return {
			ok: false,
			failureMessage: 'Password must be at least 6 characters'
		};
	}
	
	if (newPassword === currentPassword) {
		return {
			ok: false,
			failureMessage: 'New password must be different from old password'
		};
	}
	
	if (newPassword !== confirmPassword) {
		return {
			ok: false,
			failureMessage: 'New passwords do not match'
		};
	}

	// Password validated
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(newPassword, salt);

	// Update password
	const result = await db.collection('userauthentications').update(
		{ email: user.email },
		{ $set: { password: hash } }
	);

	if (result.result.nModified === 1) {
		// Log change password action
		const action = {
			action: 'Change password',
			target: user.username,
			targetCollection: 'userauthentications',
			date: new Date(),
			who: user.username
		};

		db.collection('actions').insert(action);

		return { 
			ok: true,
			action: action
		}
	}
	else return new Error('Unable to change password: database error');
}


/**
 * Change a user's password. Their current password must be provided.
 * @param {*} user 
 * @param {String} username
 * @param {String} newPassword 
 * @param {String} confirmPassword 
 */
const resetPassword = async function(user, username, newPassword, confirmPassword) {
	if (!user) return new Error('Not logged in');

	const authorized = await permission.checkPermission(user, ['admin:resetpassword-user']);
	if (authorized !== true) return authorized;

	// Validate parameters
	if (!username) return new Error('Username required.');
	if (!newPassword) return new Error('Password required.');
	if (!confirmPassword) return new Error('Confirm password required.');
	if (newPassword !== confirmPassword) return new Error('Passwords do not match.');

	const db = await connect();

	// Ensure user exists
	const userauthentication = await db.collection('userauthentications').findOne({username});
	if (!userauthentication) return new Error(`User '${username}' not found.`);

	// Password validation
	
	// Verify length
	const minLength_raw = await db.collection('settings').findOne({key:'auth_password_min_length'});
	const minLength = minLength_raw.value;

	if (newPassword.length < minLength) return new Error(`Password must be at least ${minLength} characters.`);
	
	// Password validated
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(newPassword, salt);

	// Update password
	const result = await db.collection('userauthentications').update(
		{ username: username },
		{ $set: { password: hash } }
	);

	if (result.result.nModified === 1) {
		// Log change password action
		const action = {
			action: 'Reset password',
			target: username,
			targetCollection: 'userauthentications',
			date: new Date(),
			who: user.username
		};

		db.collection('actions').insert(action);

		return {
			ok: true,
			action: action
		}
	}
	else return new Error('Unable to change password: database error');
}


/**
 * Check if authentication was successful
 * @param {*} user 
 */
const authenticate = async function(user) {
	if (user) {
		return { ok: true };
	}
	else {
		return { ok: false };
	}
}


export default {
	login,
	adminLogin,
	refresh,
	logout,
	changePassword,
	resetPassword,
	authenticate
}
