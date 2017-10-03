import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const getChallenge = (params) => {
	return gql`
	query GetChallenge($key:String!){
		getChallenge(key:$key){ ${params} }
	}`;
}

const getChallenges = (params) => {
	return gql`
	query GetChallenges{
		getChallenges{ ${params} }
	}`;
}

const getAllChallenges = (params) => {
	return gql`
	query GetAllChallenges{
		getAllChallenges{ ${params} }
	}`;
}


// ===========
//	MUTATIONS
// ===========



export {
	getChallenge,
	getChallenges,
	getAllChallenges
};
