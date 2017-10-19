import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Intent } from '@blueprintjs/core';
import { refresh, logout } from '../../actions/authActions';
import NotificationToaster from './NotificationToaster';


const MutationAccessRefresh = gql`
mutation GetRefresh($refreshToken: String!){
	refresh(refreshToken:$refreshToken) {
		ok message access_token
  }
}`;

const MutationAccessRefreshOptions = {
	name: 'MutationAccessRefresh'
};

const mapStateToProps = (state, ownProps) => {
	return { authenticated: state.auth.login.authenticated };
}

@connect()
@graphql(MutationAccessRefresh, MutationAccessRefreshOptions)
@autobind
class LoginRefresh extends React.Component {
	static propTypes = {
		interval: PropTypes.number,
		refreshToken: PropTypes.string,
		setRefreshing: PropTypes.func
	}

	static defaultProps = {
		interval: 10 * 60 * 1000	// default interval of 10 minutes
	}

	componentWillUnmount() {
		// Stop timer
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
		}
	}

	componentDidMount() {
		// Start timer
		this.refreshAccessToken();
		this.refreshInterval = setInterval(this.refreshAccessToken, this.props.interval);
	}

	async refreshAccessToken() {
		if (!this.props.authenticated) {
			// Don't need to do anything if not authenticated
			return;
		}

		if (!this.props.refreshToken) {
			// Don't try to refresh if there is no refresh token
			this._dispatchLogout('missing token');
			return;
		}
		
		if (this.props.setRefreshing) this.props.setRefreshing(true);

		// Send refresh request
		try {
			const result = await this.props.MutationAccessRefresh({
				variables: { refreshToken: this.props.refreshToken }
			});
			
			if (result.data.refresh.ok) {
				// Refresh successful
				if (this.props.setRefreshing) this.props.setRefreshing(false);
				this.props.dispatch(refresh(accessToken), new Date());
			}
			else {
				// Refresh failed
				this._dispatchLogout(result.data.refresh.message);
			}
		}
		catch (err) {
			this._dispatchLogout(err.toString());
		}
	}

	_dispatchLogout(message) {
		if (this.props.setRefreshing) this.props.setRefreshing(false, message);
		console.warn(`Refresh access failed: ${message}`);
		this.props.dispatch(logout(new Date()));
	}

	render() {
		return null;
	}
}


export default LoginRefresh;
