import React from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Spinner, Button, Intent } from '@blueprintjs/core';
import { getUserByEmail } from '../../../../graphql/user';
import { logout } from '../../../../actions/authActions';
import axios from 'axios';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from '../../components/Title';
import LoginRefresher from '../../../sharedComponents/LoginRefresher';
import API from '../../../../API';

import '../../../scss/components/_dashboard.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		email: state.auth.login.email,
		refresh: state.auth.tokens.refresh
	}
}

const QueryMeOptions = {
	name: 'QueryMe',
	options: ({email}) => ({ variables: {email} }),
	skip: (ownProps) => !ownProps.authenticated
}

@connect(mapStateToProps)
@graphql(getUserByEmail('firstname lastname username'), QueryMeOptions)
@withRouter
@autobind
class Dashboard extends React.Component {
	state = {
		logoutLoading: false
	}

	async logout() {
		this.setState({logoutLoading: true});

		const config = {
			url: API.api,
			method: 'POST',
			timeout: 10000,
			data: {
				variables: { refreshToken: this.props.refresh },
				query: 
				`mutation LogoutUser($refreshToken:String!) { 
					logout(refreshToken:$refreshToken) {
						ok failureMessage
					}
				}`
			}
		}

		// Send logout request to server
		const result = await axios(config);

		if (!result.data.data.logout.ok) {
			console.warn(result.data.data.logout.failureMessage);
		}

		this.setState({logoutLoading: false}, () => {
			this.props.dispatch(logout(new Date()));
			this.props.history.push('/');
		});
	}

	render() {
		if (!this.props.authenticated) {
			return <Redirect to='/login'/>
		}
		else {
			let content = (
				<div className='dashboard loading'>
					<Spinner className='pt-large'/>
				</div>
			);

			if (!this.props.QueryMe.loading) {
				const { firstname } = this.props.QueryMe.getUserByEmail;

				content = (
					<div className='dashboard'>
						<h2>Hello, {firstname}!</h2>
						<p>
							Welcome to your dashboard.
							This area will be updated with more information as the event approaches,
							so watch this space and get connected on <a href='https://www.facebook.com/events/131023924193281'>Facebook</a>!
							Be sure to remember your login details as you will need to login on the day of the event.
						</p>
						<p>
							If you haven't paid yet, please go <Link to='/pay'>here</Link> to see payment details.
						</p>
						<Button text='Log out' style={{marginTop: '2rem'}} intent={Intent.WARNING} 
							onClick={this.logout} loading={this.state.logoutLoading}/>
					</div>
				);
			}
			
			return (
				<main id='dashboard'>
					<LoginRefresher refreshToken={this.props.refresh}/>
					<Title notAnimated/>
					<ScrollAnimation animateOnce animateIn='zoomIn' offset={0} duration={0.5}>
						{content}
					</ScrollAnimation>
				</main>
			);
		}
	}
}


export default Dashboard;
