import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Link, Redirect } from 'react-router-dom';
import { Button } from '@blueprintjs/core/dist/components/button/buttons';
import { Intent } from '@blueprintjs/core/dist/common/intent';
import axios from 'axios';
import { connect } from 'react-redux';
import ScrollAnimation from 'react-animate-on-scroll';
import { login } from '../../../actions/authActions';
import LoginForm from '../../../../../lib/react/components/forms/LoginForm';
import Authenticated from '../../../../../lib/react/components/utility/Authenticated';
import Title from './Title';
import API from '../../../API';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		remember: state.auth.login.remember,
		email: state.auth.login.email
	}
}

@connect(mapStateToProps)
@autobind
class Login extends React.Component {
	static propTypes = {
		remember: PropTypes.bool,
		next: PropTypes.string
	}

	static defaultProps = {
		next: '/dashboard',
		notAnimated: false
	}

	async loginHandler(email, password) {
		const config = {
			url: API.api,
			method: 'POST',
			timeout: 10000,
			data: {
				variables: { email, password },
				query: 
				`mutation Login($email: String!, $password: String!) {
					login(email: $email, password: $password) {
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
		return result.data.data.login;
	}

	render() {
		if (this.props.authenticated) {
			return <Redirect to={this.props.next}/>
		}
		else {
			const content = (
				<div style={{paddingBottom: '2rem', background: 'rgba(255,255,255,0.5)', maxWidth: '30rem', margin: 'auto', marginBottom: '4rem', marginTop: '2rem', borderRadius: '0.3rem'}}>
					<h2 style={{paddingTop: '2rem', paddingBottom: '1rem', textAlign: 'center'}}>
						Login
					</h2>
					<LoginForm 
						loginAction={login} 
						authenticationHandler={this.loginHandler}
						email={this.props.remember&&this.props.email ? this.props.email : null}
						remember={this.props.remember}
						next={this.props.next}
					/>
				</div>
			);

			return (
				<main>
					<Title notAnimated/>

					{this.props.notAnimated ? 
						content
						:
						<ScrollAnimation animateOnce animateIn='fadeInUp' offset={0} duration={0.5}>
							{content}
						</ScrollAnimation>
					}
				</main>
			);
		}
	}
}


export default Login;
