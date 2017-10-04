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

const createChallenge = (params) => {
	return gql`
	mutation CreateChallenge($key:String!,$group:String!,$type:String!,$passphrase:String,$title:String,$description:String){
		createChallenge(key:$key,group:$group,type:$type,passphrase:$passphrase,title:$title,description:$description){
			${params}
		}
	}`;
}

const deleteChallenge = (params) => {
	return gql`
	mutation DeleteChallenge($key:String!){
		deleteChallenge(key:$key){ ${params} }
	}`;
}


export {
	getChallenge,
	getChallenges,
	getAllChallenges,
	createChallenge,
	deleteChallenge
};
