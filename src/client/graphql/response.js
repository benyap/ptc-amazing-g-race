import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const getTeamResponses = (params) => {
	return gql`
	query GetTeamResponses($challengeKey:String!,$itemKey:String!){
		getTeamResponses(challengeKey:$challengeKey,itemKey:$itemKey){ ${params} }
	}`;
}

const getResponse = (params) => {
	return gql`
	query GetResponse($responseId:ID!){
		getResponse(responseId:$responseId){ ${params} }
	}`;
}

const getResponseData = (params) => {
	return gql`
	query GetResponseData($responseId:ID!){
		getResponseData(responseId:$responseId){ ${params} }
	}`;
}

const getResponses = (params) => {
	return gql`
	query GetResponses($challengeKey:String,$itemKey:String,$uncheckedOnly:Boolean){
		getResponses(challengeKey:$challengeKey,itemKey:$itemKey,uncheckedOnly:$uncheckedOnly){ ${params} }
	}`;
}


// ===========
//	MUTATIONS
// ===========

const addResponse = (params) => {
	return gql`
	mutation AddResponse($challengeKey:String!,$itemKey:String!,$responseType:String!,$responseValue:String){
		addResponse(challengeKey:$challengeKey,itemKey:$itemKey,responseType:$responseType,responseValue:$responseValue){ ${params} }
	}`;
}

const checkResponse = (params) => {
	return gql`
	mutation CheckResponse($responseId:ID!,$responseValid:Boolean!,$retry:Boolean!,$pointsAwarded:Float!){
		checkResponse(responseId:$responseId,responseValid:$responseValid,retry:$retry,pointsAwarded:$pointsAwarded){ ${params} }
	}`;
}


export {
	getTeamResponses,
	getResponse,
	getResponseData,
	getResponses,
	addResponse,
	checkResponse
};
