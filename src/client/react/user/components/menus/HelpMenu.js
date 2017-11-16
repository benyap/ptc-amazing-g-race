import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { withRouter } from 'react-router-dom';
import { Position, Spinner, Menu, MenuItem, MenuDivider, Intent } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { logout } from '../../../../actions/authActions';
import axios from 'axios';
import API from '../../../../API';
import MenuButton from '../../../../../../lib/react/components/MenuButton';
import LoginRefresher from '../../../components/LoginRefresher';
import LogoutFunction from '../../../components/LogoutFunction';
import NotificationToaster from '../../../components/NotificationToaster';

import '../../scss/components/_help-menu.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
		access: state.auth.tokens.access,
		refresh: state.auth.tokens.refresh
	}
}

@connect(mapStateToProps)
@withRouter
@autobind
class HelpMenu extends React.Component {
	state = {
		logoutLoading: false,
		refreshLoading: false
	}

	menu = (
		<Menu>
			<MenuItem text='Team dashboard' iconName='people' onClick={this.navigate('/dashboard')}/>
			<MenuItem text='Challenges' iconName='flag' onClick={this.navigate('/dashboard/challenges')}/>
			<MenuItem text='News feed' iconName='feed' onClick={this.navigate('/dashboard/feed')}/>
			<MenuDivider/>
			<MenuItem text='Instructions' iconName='clipboard' onClick={this.navigate('/dashboard/instructions')}/>
			<MenuItem text='Contacts' iconName='phone' onClick={this.navigate('/dashboard/contacts')}/>
			<MenuItem text='About' iconName='info-sign' onClick={this.navigate('/dashboard/about')}/>
			<MenuDivider/>
			<MenuItem text='Logout' iconName='log-out' onClick={this.logout}/>
		</Menu>
	);

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	navigate(to) {
		return () => {
			this.props.history.push(to);
		}
	}

	async logout() {
		if (this._mounted) this.setState({logoutLoading: true});

		await LogoutFunction(this.props.access, this.props.refresh);

		if (this._mounted) this.setState({logoutLoading: false});
		this.props.dispatch(logout(new Date()));
		this.props.history.push('/');
	}

	setRefreshing(isRefreshing, errorMessage) {
		if (this._mounted && this.state.refreshLoading != isRefreshing) {
			this.setState({refreshLoading: isRefreshing});
		}
		
		if (errorMessage) {
			NotificationToaster.show({
				intent: Intent.WARNING,
				message: errorMessage
			});
		}
	}
	
	render() {
		return (
			<div id='help-menu'>
				<div className='help-button'>
					<LoginRefresher interval={10*60*1000} refreshToken={this.props.refresh} setRefreshing={this.setRefreshing}/>
					{this.state.refreshLoading ? 
						<div className='refresh-loading'>
							<Spinner className='pt-small'/>
						</div>
						:null
					}
					<MenuButton buttonClass='pt-large' 
						menu={this.menu} iconName='menu' position={Position.BOTTOM_RIGHT}
						loading={this.state.logoutLoading}/>
				</div>
			</div>
		);
	}
}


export default HelpMenu;
