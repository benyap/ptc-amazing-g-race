import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const getAllStories = (params) => {
	return gql`
	query GetAllStories($storyType:StoryType,$limit:Int, $skip:Int){
		getAllStories(storyType:$storyType,limit:$limit, skip:$skip) { ${params} }
	}`;
}


const getStories = (params) => {
	return gql`
	query GetStories($storyType:StoryType,$limit:Int, $skip:Int){
		getStories(storyType:$storyType,limit:$limit, skip:$skip) { ${params} }
	}`;
}


// ===========
//	MUTATIONS
// ===========

const setStoryPublished = (params) => {
	return gql`
	mutation SetStoryPublished($storyId:ID!,$publish:Boolean!){
		setStoryPublished(storyId:$storyId,publish:$publish){ ${params} }
	}`;
}


const deleteStory = (params) => {
	return gql`
	mutation DeleteStory($storyId:ID!){
		deleteStory(storyId:$storyId){ ${params} }
	}`;
}


const createStory = (params) => {
	return gql`
	mutation CreateStory($type:StoryType!,$content:String!,$iconName:String!,$intent:StoryIntent!){
		createStory(type:$type,content:$content,iconName:$iconName,intent:$intent){ ${params} }
	}`;
}


const createUserStory = (params) => {
	return gql`
	mutation CreateUserStory($content:String!){
		createUserStory(content:$content){ ${params} }
	}`;
}

const setStoryLiked = (params) => {
	return gql`
	mutation SetStoryLike($storyId:ID!,$like:Boolean!){
		setStoryLike(storyId:$storyId,like:$like){ ${params} }
	}`;
}


export {
	getAllStories,
	getStories,
	setStoryPublished,
	deleteStory,
	createStory,
	createUserStory,
	setStoryLiked
};
