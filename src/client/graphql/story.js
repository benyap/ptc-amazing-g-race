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



export {
	getAllStories,
	getStories
};
