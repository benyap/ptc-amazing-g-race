import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Base from '../components/Base';
import HelpMenu from '../components/HelpMenu';


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
				pathname: '/login',
				state: { next: '/dashboard' }
			}}/>;
		}

		let { url } = this.props.match;

		return (
			<div>
				<Base/>
				<HelpMenu/>
			</div>
		);
	}
}


export default Dashboard;
