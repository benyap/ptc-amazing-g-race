import connect from '../connect';
import permission from '../permission';
import { s3, s3Admin, AWS_S3_BUCKET, AWS_S3_UPLOAD_LOCATION } from '../s3';


/**
 * Upload a file to s3 inside the specified collection
 * @param {*} user 
 * @param {*} object 
 * @param {String} collection 
 * @param {String} key 
 */
const _uploadObject = async function(user, object, collection, key, name) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:upload-object']);
	if (authorized !== true) return authorized;
	
	if (!object) return new Error('No object to upload.');
	if (!collection) return new Error('Collection is required.');
	if (!key) return new Error('Object key is required.');
	if (!name) return new Error('The file name is required.');
	
	try {
		let actionString;

		const params = {
			Bucket: `${AWS_S3_BUCKET}/${AWS_S3_UPLOAD_LOCATION}/${collection}`, 
			Body: object.data, 
			Key: `${key}`,
			ServerSideEncryption: 'AES256',
			Metadata: {
				username: user.username,
				collection: collection
			}
		};

		let s3User = s3;

		const isAdmin = await permission.checkPermission(user, ['admin:upload-asset']);
		if (isAdmin === true) {
			s3User = s3Admin;
		}

		const uploadResult = await s3User.putObject(params).promise();

		const db = await connect();

		// Check if the file exists
		const uploadCheck = await db.collection('uploads').findOne({ collection, key });
		
		if (uploadCheck) {
			// Upload already exists, update the object
			actionString = 'Update uploaded object';

			db.collection('uploads').update(
				// Selector
				{ collection, key },
				// Update
				{ $set: { version: uploadResult.VersionId, lastUpdated: new Date() } }
			);
		}
		else {
			// New upload
			actionString = 'Upload object';

			const uploadObject = {
				key: key,
				name: name,
				version: uploadResult.VersionId,
				collection: collection,
				bucket: params.Bucket,
				size: object.size,
				type: object.mimetype,
				uploadedBy: user.username,
				lastUpdated: new Date()
			}
			db.collection('uploads').insert(uploadObject);
		}

		// Log action
		const action = {
			action: actionString,
			target: key,
			targetCollection: 'uploads',
			who: user.username,
			date: new Date(),
			infoJSONString: JSON.stringify({
				key: key,
				name: name,
				bucket: params.Bucket,
				type: object.mimetype,
				size: object.size
			})
		};
		db.collection('actions').insert(action);

		return {
			ok: true,
			action: action
		}
	}
	catch (err) {
		return new Error(err.toString());
	}
}

/**
 * Delete an object from S3
 * @param {*} user 
 * @param {String} collection 
 * @param {String} key 
 */
const _deleteObject = async function(user, collection, key) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:delete-object']);
	if (authorized !== true) return authorized;
	
	if (!collection) return new Error('Collection is required.');
	if (!key) return new Error('Object key is required.');

	try {
		const params = {
			Bucket: `${AWS_S3_BUCKET}/${AWS_S3_UPLOAD_LOCATION}/${collection}`, 
			Key: `${key}`
		}

		const deleteResult = await s3Admin.deleteObject(params).promise();

		const db = await connect();

		// Remove object from database
		const result = await db.collection('uploads').remove({ collection, key });

		if (result.result.n < 1) {
			return new Error(`Object with the key '${key}' was not deleted because it was not found.`);
		}

		// Log action
		const action = {
			action: 'Delete object',
			target: key,
			targetCollection: 'uploads',
			who: user.username,
			date: new Date(),
			infoJSONString: JSON.stringify({
				key: key,
				bucket: params.Bucket,
				version: deleteResult.VersionId
			})
		};
		db.collection('actions').insert(action);
		
		return {
			ok: true,
			action: action
		}
	}
	catch (err) {
		return new Error(err.toString());
	}
}



/**
 * Get a signed URL to retrieve an uploaded object from S3
 * @param {*} user 
 * @param {String} key 
 */
const _getObject = async function(user, key) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:get-objectsFromS3']);
	if (authorized !== true) return authorized;
	
	if (!key) return new Error('Object key is required.');

	// Remove prefix if it exists
	const prefix = 'uploads/';
	const startFrom = key.indexOf(prefix) >= 0 ? key.indexOf(prefix) + prefix.length : 0;

	const params = {
		Bucket: `${AWS_S3_BUCKET}/uploads`, 
		Key: key.substring(startFrom),
		Expires: 60
	};
	
	// Get download url
	const url = s3.getSignedUrl('getObject', params);

	return {
		data: url,
		date: new Date()
	}
}


/**
 * List uploaded objects from S3
 * @param {*} user 
 * @param {Number} MaxKeys 
 * @param {String} Prefix 
 * @param {String} StartAfter 
 */
const _listObjectsFromS3 = async function(user, MaxKeys, Prefix, StartAfter) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['admin:list-objectsFromS3']);
	if (authorized !== true) return authorized;
	
	const params = {
		Bucket: `${AWS_S3_BUCKET}`,
		MaxKeys,
		Prefix: (Prefix?`uploads/${Prefix}`:`uploads/`),
		Delimiter: '/',
		StartAfter
	};

	return await s3Admin.listObjectsV2(params).promise();
}


export default {
	_uploadObject,
	_deleteObject,
	_getObject,
	_listObjectsFromS3
}
