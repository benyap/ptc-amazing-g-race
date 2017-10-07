import React from 'react';
import axios from 'axios';
import autobind from 'core-decorators/es/autobind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';
import API from '../../../../API'
import MenuButton from '../../../../../../lib/react/components/MenuButton';
import { logout } from '../../../../actions/authActions';
import LoginRefresher from '../../../components/LoginRefresher';
import LogoutFunction from '../../../components/LogoutFunction';
import NotificationToaster from '../../../components/NotificationToaster';
import SettingsMenu from './SettingsMenu';


const mapStateToProps = (state, ownProps) => {
	return { 
		access: state.auth.tokens.access,
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

		await LogoutFunction(this.props.access, this.props.refresh);
		
		this.setState({loading: false});
		this.props.dispatch(logout(new Date()));
	}

	setRefreshing(isRefreshing, errorMessage) {
		if (this.state.loading !== isRefreshing) {
			this.setState({ loading: isRefreshing });
		}

		if (errorMessage) {
			NotificationToaster.show({
				intent: Intent.WARNING,
				message: errorMessage
			});
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
