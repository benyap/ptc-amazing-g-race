import connect from '../connect';
import permission from '../permission';
import { s3, s3Admin, AWS_S3_UPLOAD_BUCKET } from '../s3';


/**
 * Upload a file to s3 inside the specified collection
 * @param {*} user 
 * @param {*} object 
 * @param {String} collection 
 * @param {String} key 
 */
const _uploadObject = async function(user, object, collection, key) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:upload-object']);
	if (authorized !== true) return authorized;
	
	if (!object) return new Error('No object to upload.');
	if (!collection) return new Error('Collection is required.');
	if (!key) return new Error('Object key is required.');
	
	try {
		const params = {
			Bucket: `${AWS_S3_UPLOAD_BUCKET}${collection}`, 
			Body: object.data, 
			Key: `${key}`
		}

		const uploadResult = await s3.putObject(params).promise();

		const db = await connect();
		
		// Log upload
		const uploadObject = {
			key: key,
			version: uploadResult.VersionId,
			collection: collection,
			bucket: params.Bucket,
			size: object.size,
			type: object.mimetype,
			uploadedBy: user.username,
			lastUpdated: new Date()
		}
		db.collection('uploads').insert(uploadObject);

		// Log action
		const action = {
			action: 'Upload object',
			target: key,
			targetCollection: 'uploads',
			who: user.username,
			date: new Date(),
			infoJSONString: JSON.stringify({
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
	
	const authorized = await permission.checkPermission(user, ['user:delete-object']);
	if (authorized !== true) return authorized;
	
	if (!collection) return new Error('Collection is required.');
	if (!key) return new Error('Object key is required.');

	try {
		const params = {
			Bucket: `${AWS_S3_UPLOAD_BUCKET}${collection}`, 
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


export default {
	_uploadObject,
	_deleteObject
}
