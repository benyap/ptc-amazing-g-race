import database from '../../db';


const _uploadObject = async function(root, params, ctx, options) {
	return database.upload._uploadObject(ctx.user, ctx.files.file, params.collection, params.key, null);
}


export default {
	_uploadObject
};
