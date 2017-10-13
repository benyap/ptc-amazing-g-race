import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========



// ===========
//	MUTATIONS
// ===========

const resetPassword = (params) => {
	return gql`
	mutation ResetPassword($username:String!, $newPassword:String!, $confirmPassword:String!){
		resetPassword(username:$username, newPassword:$newPassword, confirmPassword:$confirmPassword){ ${params} }
	}`;
}


export {
	resetPassword
};
