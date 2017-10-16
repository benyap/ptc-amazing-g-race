import {
	GraphQLEnumType
} from 'graphql';


const storyIntentType = new GraphQLEnumType({
	name: 'StoryIntent',
	description: 'The intent type of a story',
	values: {
		none: { value: 'none' },
		primary: { value: 'primary' },
		success: { value: 'success' },
		danger: { value: 'danger' },
		warning: { value: 'warning' }
	}
});


export default storyIntentType;
