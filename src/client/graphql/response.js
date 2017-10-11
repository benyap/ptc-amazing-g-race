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


// ===========
//	MUTATIONS
// ===========

const addResponse = (params) => {
	return gql`
	mutation AddResponse($challengeKey:String!,$itemKey:String!,$responseType:String!,$responseValue:String){
		addResponse(challengeKey:$challengeKey,itemKey:$itemKey,responseType:$responseType,responseValue:$responseValue){ ${params} }
	}`;
}


export {
	getTeamResponses,
	addResponse
};
