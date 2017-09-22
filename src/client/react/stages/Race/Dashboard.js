import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Base from '../Base';
import HelpMenu from '../HelpMenu';


const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated
	}
}

@connect(mapStateToProps)
class Dashboard extends React.Component {

	render() {
		if (!this.props.authenticated) {
			return <Redirect to={{
				pathname: '/',
				state: { next: '/dashboard' }
			}}/>;
		}

		return (
			<div>
				<Base/>
				<HelpMenu/>
			</div>
		);
	}
}


export default Dashboard;