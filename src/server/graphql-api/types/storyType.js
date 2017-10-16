import {
	GraphQLInterfaceType,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLBoolean,
	GraphQLList,
	GraphQLEnumType,
	GraphQLInputObjectType
} from 'graphql';

import {
	GraphQLDateTime
} from 'graphql-iso-date';

import storyTypeType from './storyTypeType';
import storyIntentType from './storyIntentType';


const storyType = new GraphQLObjectType({
	name: 'Story',
	description: 'A story that can be displayed on the news feed.',
	fields: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		type: {
			type: new GraphQLNonNull(storyTypeType),
			description: 'The type of story'
		},
		date: {
			type: new GraphQLNonNull(GraphQLDateTime),
			description: 'The date the story was created'
		},
		createdBy: {
			type: GraphQLString,
			description: 'The user who created the story. This can be null if it was automatically generated.'
		},
		published: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the story should be published to the public feed'
		},
		iconName: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'Name of the icon to include with the story'
		},
		content: {
			type: GraphQLString,
			description: 'The content in the story (Markdown supported)'
		},
		intent: {
			type: new GraphQLNonNull(storyIntentType),
			description: 'The intent of the story (one of none, primary, success, danger or warning)'
		},
		edited: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description: 'True if the story has been edited'
		},
		likes: {
			type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
			description: 'The users who like this story'
		}
	}
});


export default storyType;
