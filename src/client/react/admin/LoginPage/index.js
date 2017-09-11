import React from 'react';
import { autobind } from 'core-decorators';
import axios from 'axios';
import API from '../../../API';
import { loginAdmin } from '../../../actions/authActions';
import LoginForm from '../../../../../lib/react/components/forms/LoginForm';
import Authenticated from '../../../../../lib/react/components/utility/Authenticated';
import Redirector from './Redirector';


const titleStyle = {
	marginTop: '16vh',
	marginBottom: '5vh',
	textAlign: 'center'
}

@autobind
class LoginPage extends React.Component {
	async adminLoginHandler(email, password) {
		const config = {
			url: API.api,
			method: 'POST',
			timeout: 10000,
			params: {
				variables: { email, password },
				query: 
				`mutation AdminLogin($email: String!, $password: String!) {
					adminLogin(email: $email, password: $password) {
						ok
						message
						access_token
						refresh_token
					}
				}`
			}
		}
		
		// Send login request to server
		let result = await axios(config);

		// Return result
		return result.data.data.adminLogin;
	}

	render() {
		return (
			<div>
				<main id='admin-login'>
					<p style={{margin: '1rem'}}>The Amazing GRace</p>
					<h2 style={titleStyle}>Administrator Login</h2>

					<Authenticated>
						<Redirector/>
					</Authenticated>

					<LoginForm 
						loginAction={loginAdmin} 
						authenticationHandler={this.adminLoginHandler}
						next='/admin/dashboard'/>
				</main>
			</div>
		);
	}
}


export default LoginPage;
