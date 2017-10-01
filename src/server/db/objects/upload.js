import connect from '../connect';
import permission from '../permission';
import { s3, AWS_S3_UPLOAD_BUCKET } from '../s3';


/**
 * Upload a file to s3 inside the specified collection
 * @param {*} user 
 * @param {String} collection 
 * @param {String} key 
 * @param {*} object 
 */
const _uploadObject = async function(user, object, collection, key, callback) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:upload-object']);
	if (authorized !== true) return authorized;
	
	if (!object) return new Error('No object to upload.');
	if (!collection) return new Error('Collection is required.');
	if (!key) return new Error('Object key is required.');

	const params = {
		Bucket: `${AWS_S3_UPLOAD_BUCKET}${collection}`, 
		Body: object.data, 
		Key: `${key}`
	}

	let upload = await new Promise(
		resolve => {
			s3.putObject(params, (err, data) => {
				resolve({err, data});
			});
		}
	);
	
	// If a callback is provided, hand control over to the callback to manage
	if (callback) { 
		return callback(upload);
	}
	else {
		const db = await connect();

		// Log upload
		const uploadObject = {
			key: key,
			version: upload.data.VersionId,
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
}


export default {
	_uploadObject
}
