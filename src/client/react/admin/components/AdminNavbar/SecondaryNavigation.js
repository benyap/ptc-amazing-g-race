import React from 'react';
import autobind from 'core-decorators/es/autobind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import API from '../../../../API'
import MenuButton from '../../../../../../lib/react/components/MenuButton';
import SettingsMenu from './SettingsMenu';
import { withRouter } from 'react-router-dom';
import { logout } from '../../../../actions/authActions';
import LoginRefresher from '../../../components/LoginRefresher';


const mapStateToProps = (state, ownProps) => {
	return {
		refresh: state.auth.tokens.refresh
	}
}

@connect(mapStateToProps)
@withRouter
@autobind
class SecondaryNavigation extends React.Component {
	static propTypes = {
		authenticated: PropTypes.bool
	}

	state = {
		loading: false
	}

	async logout() {
		this.setState({loading: true});

		const config = {
			url: API.api,
			method: 'POST',
			data: {
				variables: { refreshToken: this.props.refresh },
				query: 
				`mutation LogoutUser($refreshToken:String!) { 
					logout(refreshToken:$refreshToken) {
						ok
						failureMessage
					}
				}`
			}
		}

		// Send logout request to server
		const result = await axios(config);
		this.setState({loading: false});
		this.props.dispatch(logout(new Date()));
		
		if (!result.data.data.logout.ok) {
			console.warn(result.data.data.logout.failureMessage);
		}
	}

	setRefreshing(isRefreshing, error) {
		if (this.state.loading !== isRefreshing) {
			this.setState({ loading: isRefreshing });
		}

		if (error) {
			// TODO: maybe - add notification that refresh failed?
			console.warn(error);
		}
	}

	render() {
		if (this.props.authenticated) {
			return (
				<div style={{marginRight: '0.5rem'}}>
					<MenuButton buttonClass='pt-minimal' loading={this.state.loading} iconName='cog' menu={
						<SettingsMenu handleLogout={this.logout}/>
					}/>
					<LoginRefresher refreshToken={this.props.refresh} setRefreshing={this.setRefreshing}/>
				</div>
			);
		}
		else return null;
	}
}


export default SecondaryNavigation;