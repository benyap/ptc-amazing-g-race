import {
	GraphQLEnumType
} from 'graphql';


const storyTypeType = new GraphQLEnumType({
	name: 'StoryType',
	description: 'A story type',
	values: {
		challengeUnlock: { value: 'challengeUnlock' },
		challengeRespond: { value: 'challengeRespond' },
		challengeCheck: { value: 'challengeCheck' },
		useHint: { value: 'useHint' },
		custom: { value: 'custom' }
	}
});


export default storyTypeType;
