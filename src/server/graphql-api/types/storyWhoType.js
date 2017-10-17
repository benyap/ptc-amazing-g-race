import {
	GraphQLEnumType
} from 'graphql';


const storyWhoType = new GraphQLEnumType({
	name: 'StoryWho',
	description: 'The author type',
	values: {
		me: { value: 'me' },
		admins: { value: 'admins' },
		generated: { value: 'generated' }
	}
});


export default storyWhoType;
