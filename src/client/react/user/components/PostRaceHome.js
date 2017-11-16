import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import { getUserByEmail } from '../../../graphql/user';
import { logout } from '../../../actions/authActions';
import LogoutFunction from '../../components/LogoutFunction';
import Title from './Title';
import ScrollAnimation from 'react-animate-on-scroll';

import '../scss/components/_registration-closed.scss';


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
	options: ({email}) => ({ variables: {email} }),
	skip: (ownProps) => !ownProps.authenticated
}

@connect(mapStateToProps)
@graphql(getUserByEmail('_id firstname lastname username'), QueryMeOptions)
@withRouter
@autobind
class PostRaceHome extends React.Component {
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
		let name;

		if (this.props.authenticated) {
			name = this.props.QueryMe.loading ? '!' : ', ' + this.props.QueryMe.getUserByEmail.firstname + '!';
		}
		
		return (
			<main id='registration-closed'>
				<Title/>
				<ScrollAnimation animateOnce animateIn='fadeIn' offset={0}>
					{ this.props.authenticated ?
						<div className='closed'>
							<h3 style={{textAlign:'center'}}>Thanks for participating{name}</h3>
							<Link to='/results' className='pt-button pt-intent-primary pt-large pt-fill login-button'>
								See the results!
							</Link>
							<Button text='Log out' className='pt-minimal pt-fill login-button' intent={Intent.PRIMARY} 
								onClick={this.logout} loading={this.state.logoutLoading} style={{marginTop:'1rem'}}/>
						</div>
						:
						<div className='closed'>
							<h3 style={{marginBottom:'1rem'}}>This event is over.</h3>
							<p>Log in to see the results!</p>
							<Link to='/login' className='pt-button pt-intent-primary pt-large pt-fill login-button'>
								Login
							</Link>
						</div>
					}
				</ScrollAnimation>
			</main>
		);
	}
}


export default PostRaceHome;
