import React from 'react';
import { autobind } from 'core-decorators';
import Authenticated from '../../../../../lib/react/components/utility/Authenticated';
import Kick from './Kick';
import AdminDashboard from './AdminDashboard';
import AdminNavbar from '../AdminNavbar';

import '../../scss/admin/_dashboard.scss';


@autobind
class DashboardPage extends React.Component {
	render() {
		return (
			<div>
				{/* Kick the user if an admin is not logged in */}
				<Authenticated isAdmin>
					<Kick/>
				</Authenticated>

				<AdminNavbar/>
				<main id='admin-dashboard'>
					<h2 style={{margin: '1rem 0.6rem'}}>Administrator Dashboard</h2>
					<AdminDashboard/>
				</main>
			</div>
		);
	}
}


export default DashboardPage;
