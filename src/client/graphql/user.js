import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const getUsers = (params) => {
	return gql`
	query GetUsers($limit:Int, $skip:Int){
		getUsers(limit:$limit, skip:$skip) { ${params} }
	}`;
}

const getUserByEmail = (params) => {
	return gql`
	query GetUserByEmail($email:String!) {
		getUserByEmail(email: $email) { ${params}	}
	}`;
}


// ===========
//	MUTATIONS
// ===========

const setUserPaidAmount = (params) => {
	return gql`
	mutation SetPaidAmount($username:String!, $amount:Float!){
		setUserPaidAmount(username:$username, amount:$amount){ ${params} }
	}`;
}

const addPermission = (params) => {
	return gql`
	mutation AddPermission($permission:String!, $username:String!){
		addPermission(permission:$permission, username:$username){ ${params} }
	}`;
}

const removePermission = (params) => {
	return gql`
	mutation RemovePermission($permission:String!, $username:String!){
		removePermission(permission:$permission, username:$username){ ${params} }
	}`;
}

const setUserTeam = (params) => {
	return gql`
	mutation SetUserTeam($username:String!,$teamId:ID!){
		setUserTeam(username:$username,teamId:$teamId){ ${params} }
	}`;
}

const removeUserTeam = (params) => {
	return gql`
	mutation RemoveUserTeam($username:String!){
		removeUserTeam(username:$username){ ${params} }
	}`;
}


export {
	getUsers,
	getUserByEmail,
	setUserPaidAmount,
	addPermission,
	removePermission,
	setUserTeam,
	removeUserTeam
};
