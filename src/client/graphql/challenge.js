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
	mutation CreateChallenge($key:String!,$order: Int!,$passphrase:String,$title:String,$description:String){
		createChallenge(key:$key,order:$order,passphrase:$passphrase,title:$title,description:$description){
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

const setChallengePublic = (params) => {
	return gql`
	mutation SetChallengePublic($key:String!,$value:Boolean!){
		setChallengePublic(key:$key,value:$value){ ${params} }
	}`;
}

const setChallengeOrder = (params) => {
	return gql`
	mutation SetChallengeOrder($key:String!,$value:Int!){
		setChallengeOrder(key:$key,value:$value){ ${params} }
	}`;
}

const setChallengePassphrase = (params) => {
	return gql`
	mutation SetChallengePassphrase($key:String!,$value:String!){
		setChallengePassphrase(key:$key,value:$value){ ${params} }
	}`;
}

const setChallengeTitle = (params) => {
	return gql`
	mutation SetChallengeTitle($key:String!,$value:String!){
		setChallengeTitle(key:$key,value:$value){ ${params} }
	}`;
}

const setChallengeDescription = (params) => {
	return gql`
	mutation SetChallengeDescription($key:String!,$value:String!){
		setChallengeDescription(key:$key,value:$value){ ${params} }
	}`;
}

const setChallengeLocked = (params) => {
	return gql`
	mutation SetChallengeLocked($key:String!,$value:Boolean!){
		setChallengeLocked(key:$key,value:$value){ ${params} }
	}`;
}


export {
	getChallenge,
	getChallenges,
	getAllChallenges,
	createChallenge,
	deleteChallenge,
	setChallengePublic,
	setChallengeOrder,
	setChallengePassphrase,
	setChallengeTitle,
	setChallengeDescription,
	setChallengeLocked,
};
