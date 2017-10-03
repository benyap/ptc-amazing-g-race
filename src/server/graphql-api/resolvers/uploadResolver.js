import database from '../../db';


const _uploadObject = async function(root, params, ctx, options) {
	return database.upload._uploadObject(ctx.user, ctx.files.file, params.collection, params.key, params.name);
}

const _deleteObject = async function(root, params, ctx, options) {
	return database.upload._deleteObject(ctx.user, params.collection, params.key);
}

const _listObjectsFromS3 = async function(root, params, ctx, options) {
	return database.upload._listObjectsFromS3(ctx.user, params.MaxKeys, params.Prefix, params.StartAfter);
}

export default {
	_uploadObject,
	_deleteObject,
	_listObjectsFromS3
};
