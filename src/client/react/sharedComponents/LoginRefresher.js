import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { refresh, logout } from '../../actions/authActions';

const MutationAccessRefresh = gql`
mutation GetRefresh($refreshToken: String!){
	refresh(refreshToken:$refreshToken) {
		ok
    message
    access_token
  }
}`;

const MutationAccessRefreshOptions = {
	name: 'MutationAccessRefresh'
};

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
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	componentDidMount() {
		// Start timer
		this.refresh();
		this.interval = setInterval(this.refresh, this.props.interval);
	}

	async refresh() {
		if (!this.props.refreshToken) {
			// Don't try to refresh if there is no refresh token
			this._dispatchLogout();
			return;
		}

		if (this.props.setRefreshing) this.props.setRefreshing(true);

		// Send refresh request
		try {
			let result = await this.props.MutationAccessRefresh({
				variables: { refreshToken: this.props.refreshToken }
			});

			if (result.data.refresh.ok) {
				// Refresh successful
				if (this.props.setRefreshing) this.props.setRefreshing(false);
				this._dispatchRefresh(result.data.refresh.access_token);
			}
			else {
				if (this.props.setRefreshing) this.props.setRefreshing(false, result.data.refresh.message);
				this._dispatchLogout();
			}
		}
		catch (e) {
			if (this.props.setRefreshing) this.props.setRefreshing(false, e);
			this._dispatchLogout();
		}
	}

	_dispatchRefresh(refreshToken) {
		this.props.dispatch(refresh(refreshToken), new Date());
	}

	_dispatchLogout() {
		this.props.dispatch(logout(new Date()));
	}

	render() {
		return null;
	}
}


export default LoginRefresh;
