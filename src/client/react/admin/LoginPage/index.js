import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import autobind from 'core-decorators/es/autobind';
import API from '../../../API';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginAdmin } from '../../../actions/authActions';
import LoginForm from '../../../../../lib/react/components/forms/LoginForm';
import Authenticated from '../../../../../lib/react/components/utility/Authenticated';


const titleStyle = {
	marginTop: '16vh',
	marginBottom: '5vh',
	textAlign: 'center'
}

const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		admin: state.auth.login.admin,
		remember: state.auth.login.remember,
		email: state.auth.login.email
	}
}

@connect(mapStateToProps)
@autobind
class LoginPage extends React.Component {
	static propTypes = {
		remember: PropTypes.bool
	}

	async adminLoginHandler(email, password) {
		const config = {
			url: API.api,
			method: 'POST',
			timeout: 10000,
			data: {
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
		const result = await axios(config);

		// Return result
		return result.data.data.adminLogin;
	}

	render() {
		const { authenticated, admin } = this.props;
		if (authenticated && admin) {
			return (
				<Redirect to='/admin/dashboard'/>
			);
		}
		else {
			return (
				<main id='admin-login'>
					<p style={{margin: '1rem'}}>The Amazing GRace</p>
					<h2 style={titleStyle}>Administrator Login</h2>
	
					<LoginForm 
						loginAction={loginAdmin} 
						authenticationHandler={this.adminLoginHandler}
						email={this.props.remember&&this.props.email ? this.props.email : null}
						remember={this.props.remember}
						next={this.props.location.state ? this.props.location.state : '/admin/dashboard'}
					/>
				</main>
			);
		}
	}
}


export default LoginPage;
