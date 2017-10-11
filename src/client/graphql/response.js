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


export {
	getTeamResponses
};
