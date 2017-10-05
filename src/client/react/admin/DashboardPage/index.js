import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Authenticated from '../../../../../lib/react/components/utility/Authenticated';
import AdminDashboard from './AdminDashboard';
import AdminNavbar from '../AdminNavbar';

import '../../scss/admin/_dashboard.scss';

const mapStateToProps = (state, ownProps) => {
	return { 
		authenticated: state.auth.login.authenticated,
		admin: state.auth.login.admin
	}
}

@connect(mapStateToProps)
@autobind
class DashboardPage extends React.Component {
	render() {
		const { authenticated, admin } = this.props;
		if (authenticated && admin) {
			return (
				<div>
					<Authenticated adminOnly hideUnauthenticated>
						<AdminNavbar/>
						<main id='admin-dashboard'>
							<h2 style={{margin: '1rem 0.6rem'}}>Administrator Dashboard</h2>
							<AdminDashboard/>
						</main>
					</Authenticated>
				</div>
			);
		}
		else {
			return (
				<Redirect to={{
					pathname: '/admin',
					state: this.props.location.pathname
				}}/>
			);	
		}
	}
}


export default DashboardPage;
