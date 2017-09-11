import React from 'react';
import { connect } from 'react-redux';

import '../../scss/tests/_authentication-dispatcher.scss';


@connect()
class AuthenticationDispatcher extends React.Component {

	login() {
		this.props.dispatch({
			type: 'AUTH_LOGIN',
			payload: {
				email: 'user@email.com',
				remember: true,
				access: 'access_' + Date.now(),
				refresh: 'refresh_' + Date.now(),
				time: new Date()
			}
		});
	}

	refresh() {
		this.props.dispatch({
			type: 'AUTH_REFRESH',
			payload: {
				access: 'access_' + Date.now(),
				time: new Date()
			}
		}
		);
	}

	logout() {
		this.props.dispatch({
			type: 'AUTH_LOGOUT',
			payload: {
				time: new Date()
			}
		}
		);
	}

	render() {
		return (
			<div role='test' className='dispatcher'>
				<p className='title'>Authentication Dispatcher</p>
				<div className='pt-button-group pt-fill'>
					<button type='button' className='pt-button' onClick={this.login.bind(this)}>Log in</button>
					<button type='button' className='pt-button' onClick={this.refresh.bind(this)}>Refresh</button>
					<button type='button' className='pt-button' onClick={this.logout.bind(this)}>Logout</button>
				</div>
			</div>
		);
	}
}


export default AuthenticationDispatcher;
