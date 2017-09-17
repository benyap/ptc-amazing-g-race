import React from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { graphql, gql } from 'react-apollo';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Spinner, Button, Intent } from '@blueprintjs/core';
import { logout } from '../../../../actions/authActions';
import Title from '../../Title';

import '../../../scss/_dashboard.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

const QueryMe = gql`
query GetMe {
  getMe {
		firstname
		lastname
    username 
  }
}`;

const QueryMeOptions = {
	name: 'QueryMe',
	options: (props) => ({
		variables: { email: props.email }
	}),
	skip: (ownProps) => {
		return !ownProps.authenticated;
	}
}

@connect(mapStateToProps)
@graphql(QueryMe, QueryMeOptions)
@withRouter
@autobind
class Dashboard extends React.Component {
	logout() {
		this.props.dispatch(logout(new Date()));
		this.props.history.push('/');
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
				let { firstname } = this.props.QueryMe.getMe;

				content = (
					<div className='dashboard'>
						<h2>Hello, {firstname}!</h2>
						<p>
							Welcome to your dashboard.
							This area will be updated with more information as the event approaches,
							so watch this space!
							Be sure to remember your login details as you will need to login on the day of the event.
						</p>
						<p>
							If you haven't paid yet, please go <Link to='/pay'>here</Link> to see payment details.
						</p>
						<Button text='Log out' style={{marginTop: '2rem'}} intent={Intent.WARNING} onClick={this.logout}/>
					</div>
				);
			}
			
			return (
				<main id='dashboard'>
					<Title notAnimated/>
					{content}
				</main>
			);
		}
	}
}


export default Dashboard;
