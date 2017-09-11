import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import axios from 'axios';
import API from '../../../API'
import MenuButton from '../../../../../lib/react/components/MenuButton';
import SettingsMenu from './SettingsMenu';
import { withRouter } from 'react-router-dom';
import { logout } from '../../../actions/authActions';


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
			params: {
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
		let result = await axios(config);
		this.setState({loading: false});
		this.props.dispatch(logout(new Date()));
		
		if (!result.data.data.logout.ok) {
			console.warn(result.data.data.logout.failureMessage);
		}
	}

	render() {
		if (this.props.authenticated) {
			return (
				<div style={{marginRight: '0.5rem'}}>
					<MenuButton minimal loading={this.state.loading} iconName='cog' menu={
						<SettingsMenu handleLogout={this.logout}/>
					}/>
				</div>
			);
		}
		else return null;
	}
}


export default SecondaryNavigation;
