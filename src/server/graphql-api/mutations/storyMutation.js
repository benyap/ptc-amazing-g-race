import {
	GraphQLString,
	GraphQLID,
	GraphQLEnumType,
	GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';

import types from '../types';
import resolvers from '../resolvers';


const createStory = {
	type: types.confirmType,
	description: 'Create a story on the newsfeed',
	args: {
		type: {
			name: 'type',
			description: 'The type of story',
			type: new GraphQLNonNull(types.storyTypeType)
		},
		content: {
			name: 'content',
			description: 'The content in the story',
			type: new GraphQLNonNull(GraphQLString)
		},
		who: {
			name: 'who',
			description: 'The author type',
			type: new GraphQLNonNull(types.storyWhoType)
		},
		iconName: {
			name: 'iconName',
			description: 'The name of the icon to be displayed along the story',
			type: new GraphQLNonNull(GraphQLString)
		},
		intent: {
			name: 'intent',
			description: 'The intent of the story (affects the colour)',
			type: new GraphQLNonNull(types.storyIntentType)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.createStory(root, params, ctx, options);
	}
}


const createUserStory = {
	type: types.confirmType,
	description: 'Create a user story on the newsfeed (basic)',
	args: {
		content: {
			name: 'content',
			description: 'The content in the story',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.createUserStory(root, params, ctx, options);
	}
}


const editStory = {
	type: types.confirmType,
	description: 'Edit a story',
	args: {
		storyId: {
			name: 'stodyId',
			description: 'The id of story to edit',
			type: new GraphQLNonNull(GraphQLID)
		},
		property: {
			name: 'property',
			description: 'The property of the story to edit (content, iconName, intent)',
			type: new GraphQLNonNull(new GraphQLEnumType({
				name: 'StoryEditProperty',
				values: {
					content: { value: 'content' },
					iconName: { value: 'iconName' },
					intent: { value: 'intent' }
				}
			}))
		},
		value: {
			name: 'value',
			description: 'The value to set the property to',
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.editStory(root, params, ctx, options);
	}
}


const deleteStory = {
	type: types.confirmType,
	description: 'Delete a story',
	args: {
		storyId: {
			name: 'stodyId',
			description: 'The id of story to delete',
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.deleteStory(root, params, ctx, options);
	}
}


const setStoryPublished = {
	type: types.confirmType,
	description: 'Set the published property of a story',
	args: {
		storyId: {
			name: 'stodyId',
			description: 'The id of story to modify',
			type: new GraphQLNonNull(GraphQLID)
		},
		publish: {
			name: 'publish',
			description: 'True if the story should be published',
			type: new GraphQLNonNull(GraphQLBoolean)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.setStoryPublished(root, params, ctx, options);
	}
}


const setStoryLike = {
	type: types.confirmType,
	description: 'Like (or unlike) a story',
	args: {
		storyId: {
			name: 'stodyId',
			description: 'The id of story',
			type: new GraphQLNonNull(GraphQLID)
		},
		like: {
			name: 'like',
			description: 'True to like the story, false to unlike the story',
			type: new GraphQLNonNull(GraphQLBoolean)
		}
	},
	resolve(root, params, ctx, options) {
		return resolvers.storyResolver.setStoryLike(root, params, ctx, options);
	}
}


export default {
	createStory,
	createUserStory,
	editStory,
	deleteStory,
	setStoryPublished,
	setStoryLike
};
