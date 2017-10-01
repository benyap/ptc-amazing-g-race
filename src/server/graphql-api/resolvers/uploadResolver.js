import database from '../../db';


const _uploadObject = async function(root, params, ctx, options) {
	return database.upload._uploadObject(ctx.user, ctx.files.file, params.collection, params.key);
}

const _deleteObject = async function(root, params, ctx, options) {
	return database.upload._deleteObject(ctx.user, params.collection, params.key);
}


export default {
	_uploadObject,
	_deleteObject
};
