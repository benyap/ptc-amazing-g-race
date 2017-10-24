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

const getChallengeById = (params) => {
	return gql`
	query GetChallengeById($id:ID!){
		getChallengeById(id:$id){ ${params} }
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

const setChallengeNotes = (params) => {
	return gql`
	mutation SetChallengeNotes($key:String!,$value:String!){
		setChallengeNotes(key:$key,value:$value){ ${params} }
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


const setChallengeItemOrder = (params) => {
	return gql`
	mutation SetChalItemOrder($key:String!,$itemKey:String!,$value:Int!){
		setChallengeItemOrder(key:$key,itemKey:$itemKey,value:$value){ ${params} }
	}`;
}


const setChallengeItemTitle = (params) => {
	return gql`
	mutation SetChalItemTitle($key:String!,$itemKey:String!,$value:String!){
		setChallengeItemTitle(key:$key,itemKey:$itemKey,value:$value){ ${params} }
	}`;
}


const setChallengeItemDescription = (params) => {
	return gql`
	mutation SetChalItemDescription($key:String!,$itemKey:String!,$value:String!){
		setChallengeItemDescription(key:$key,itemKey:$itemKey,value:$value){ ${params} }
	}`;
}


const createChallengeItem = (params) => {
	return gql`
	mutation CreateChallengeItem($key:String!,$itemKey:String!,$order:Int!,$type:String!,$title:String!){
		createChallengeItem(key:$key,itemKey:$itemKey,order:$order,title:$title,type:$type){ ${params} } 
	}`;
}


const deleteChallengeItem = (params) => {
	return gql`
	mutation DeleteChallengeItem($key:String!,$itemKey:String!){
		deleteChallengeItem(key:$key,itemKey:$itemKey){ ${params} }
	}`;
}

const removeTeamFromUnlocked = (params) => {
	return gql`
	mutation RemoveTeamFromUnlocked($key:String!,$teamId:ID!){
		removeTeamFromUnlocked(key:$key,teamId:$teamId){ ${params} }
	}`;
}


const addTeamToUnlocked = (params) => {
	return gql`
	mutation AddTeamToUnlocked($key:String!,$teamId:ID!){
		addTeamToUnlocked(key:$key,teamId:$teamId){ ${params} }
	}`;
}


const unlockAttempt = (params) => {
	return gql`
	mutation UnlockAttempt($phrase:String!){
		unlockAttempt(phrase:$phrase){ ${params} }
	}`;
}


export {
	getChallenge,
	getChallengeById,
	getChallenges,
	getAllChallenges,
	createChallenge,
	deleteChallenge,
	setChallengePublic,
	setChallengeOrder,
	setChallengePassphrase,
	setChallengeNotes,
	setChallengeTitle,
	setChallengeDescription,
	setChallengeLocked,
	createChallengeItem,
	deleteChallengeItem,
	setChallengeItemOrder,
	setChallengeItemTitle,
	setChallengeItemDescription,
	removeTeamFromUnlocked,
	addTeamToUnlocked,
	unlockAttempt
};
