import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const getTeams = (params) => {
	return gql`
	query GetTeams($skip:Int,$limit:Int) {
		getTeams(skip:$skip, limit:$limit) { ${params} }
	}`;
}

const getTeam = (params) => {
	return gql`
	query GetTeam($teamId: ID!){
		getTeam(teamId: $teamId){ ${params} }
	}`;
}


// ===========
//	MUTATIONS
// ===========

const addTeam = (params) => {
	return gql`
	mutation AddTeam($teamName:String!){
		addTeam(teamName:$teamName){ ${params} }
	}`;
}

const setTeamName = (params) => {
	return gql`
	mutation SetTeamName($teamId:ID!, $name:String!) {
		setTeamName(teamId:$teamId, name:$name) { ${params} }
	}`;
}

const setTeamPoints = (params) => {
	return gql`
	mutation SetTeamPoints($teamId:ID!, $points:Float!) {
		setTeamPoints(teamId:$teamId, points:$points) { ${params} }
	}`;
}

const removeTeam = (params) => {
	return gql`
	mutation RemoveTeam($teamId:ID!){
		removeTeam(teamId:$teamId){ ${params} }
	}`;
}


export {
	getTeams,
	getTeam,
	addTeam,
	setTeamName,
	setTeamPoints,
	removeTeam
};
