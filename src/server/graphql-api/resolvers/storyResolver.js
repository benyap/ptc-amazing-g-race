import database from '../../db';


const getStories = async function(root, params, ctx, options) {
	return database.story.getStories(ctx.user, params.storyType, params.skip, params.limit);
}

const getAllStories = async function(root, params, ctx, options) {
	return database.story.getAllStories(params.key, params.storyType, params.skip, params.limit);
}

const createStory = async function(root, params, ctx, options) {
	return database.story.createStory(ctx.user, params.type, params.content, params.iconName, params.intent);
}

const editStory = async function(root, params, ctx, options) {
	return database.story.editStory(ctx.user, params.storyId, params.property, params.value);
}

const deleteStory = async function(root, params, ctx, options) {
	return database.story.deleteStory(ctx.user, params.storyId);
}

const setStoryPublished = async function(root, params, ctx, options) {
	return database.story.setStoryPublished(ctx.user, params.storyId, params.published);
}

const setStoryLike = async function(root, params, ctx, options) {
	return database.story.setStoryLike(ctx.user, params.storyId, params.like);
}


export default {
	getStories,
	getAllStories,
	createStory,
	editStory,
	deleteStory,
	setStoryPublished,
	setStoryLike
};
