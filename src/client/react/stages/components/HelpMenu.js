import React from 'react';
import { autobind } from 'core-decorators';
import { withRouter } from 'react-router-dom';
import { Position, Spinner, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { logout } from '../../../actions/authActions';
import axios from 'axios';
import API from '../../../API';
import MenuButton from '../../../../../lib/react/components/MenuButton';
import LoginRefresher from '../../sharedComponents/LoginRefresher';

import '../../scss/components/_help-menu.scss';


const mapStateToProps = (state, ownProps) => {
	return { 
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
			<MenuItem text='Instructions' iconName='clipboard' onClick={this.navigate('/dashboard/instructions')}/>
			<MenuItem text='Challenges' iconName='map' onClick={this.navigate('/dashboard/challenges')}/>
			<MenuItem text='Completed' iconName='tick-circle' onClick={this.navigate('/dashboard/completed')}/>
			<MenuDivider/>
			<MenuItem text='Help' iconName='help' onClick={this.navigate('/dashboard/help')}/>
			<MenuItem text='Logout' iconName='log-out' onClick={this.logout}/>
		</Menu>
	);

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmoun() {
		this._mounted = false;
	}

	navigate(to) {
		return () => {
			this.props.history.push(to);
		}
	}

	async logout() {
		if (this._mounted) this.setState({logoutLoading: true});

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
		let result = await axios(config);

		if (!result.data.data.logout.ok) {
			console.warn(result.data.data.logout.failureMessage);
		}

		if (this._mounted) this.setState({logoutLoading: false});
		this.props.dispatch(logout(new Date()));
		this.props.history.push('/');
	}

	setRefreshing(refreshing) {
		if (this._mounted) this.setState({refreshLoading: refreshing});
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
