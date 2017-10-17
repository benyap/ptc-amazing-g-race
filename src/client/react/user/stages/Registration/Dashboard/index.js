import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Spinner, Button, Intent } from '@blueprintjs/core';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { getUserByEmail } from '../../../../../graphql/user';
import { logout } from '../../../../../actions/authActions';
import axios from 'axios';
import ScrollAnimation from 'react-animate-on-scroll';
import Title from '../../../components/Title';
import NotificationToaster from '../../../../components/NotificationToaster';
import LoginRefresher from '../../../../components/LoginRefresher';
import LogoutFunction from '../../../../components/LogoutFunction';

import '../../../scss/components/_dashboard.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		email: state.auth.login.email,
		access: state.auth.tokens.access,
		refresh: state.auth.tokens.refresh
	}
}

const QueryMeOptions = {
	name: 'QueryMe',
	skip: (ownProps) => !ownProps.authenticated,
	options: (props) => { 
		return { 
			variables: { email: props.email },
			fetchPolicy: 'cache-and-network'
		}
	}
}

@connect(mapStateToProps)
@graphql(getUserByEmail('_id firstname lastname username raceDetails{friends}'), QueryMeOptions)
@withRouter
@autobind
class Dashboard extends React.Component {
	state = {
		logoutLoading: false
	}

	async logout() {
		this.setState({logoutLoading: true});

		await LogoutFunction(this.props.access, this.props.refresh);
		
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
			const { getUserByEmail, loading } = this.props.QueryMe;
			let content, friends;

			if (getUserByEmail) {
				if (getUserByEmail.raceDetails.friends) {
					friends = (
						<div className='pt-callout pt-intent-primary pt-icon-info-sign'>
							<h5>Remember to invite your friends!</h5>
							By the way, you put down these people as your friends: <em>{getUserByEmail.raceDetails.friends}</em>.
							Invite them and tell them to put your name down as their friend for a chance to win movie tickets!
						</div>
					);
				}
				else {
					friends = (
						<div className='pt-callout pt-intent-primary pt-icon-info-sign'>
							<h5>Remember to invite your friends!</h5>
							By the way, if you put people down as your friends, 
							and they put your name down as their friends when they sign up,
							you have a chance of winning some movie tickets!
							You haven't put any friends down - let Ben Yap know and he can fix this for you.
						</div>
					);
				}

				content = (
					<div>
						<h2>Hello, {getUserByEmail.firstname}!</h2>
						<p>
							Welcome to your dashboard.
							This area will be updated with more information as the event approaches,
							so watch this space and get connected on <a href='https://www.facebook.com/events/131023924193281'>Facebook</a>!
							Be sure to remember your login details as you will need to login on the day of the event.
						</p>
						<p>
							If you haven't paid yet, please go <Link to='/pay'>here</Link> to see payment details.
						</p>
	
						{friends}
	
						<Button text='Log out' style={{marginTop: '1rem'}} intent={Intent.WARNING} 
							onClick={this.logout} loading={this.state.logoutLoading}/>
					</div>
				);
			}
			else if (loading) {
				content = <LoadingSpinner/>;
			}
			
			return (
				<main id='dashboard'>
					<LoginRefresher refreshToken={this.props.refresh}/>
					<Title notAnimated/>
					<ScrollAnimation animateOnce animateIn='zoomIn' offset={-500} duration={0.5}>
						<div className='dashboard pt-dark'>
							{content}
						</div>
					</ScrollAnimation>
				</main>
			);
		}
	}
}


export default Dashboard;
