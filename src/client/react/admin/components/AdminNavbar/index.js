import React from 'react';
import Navbar from '../../../../../../lib/react/components/Navbar';
import MainNavigation from './MainNavigation';
import SecondaryNavigation from './SecondaryNavigation';

import '../../../scss/admin/_navbar.scss';


class AdminNavbar extends React.Component {
	render() {
		return (
			<Navbar>
				<MainNavigation/>
				<SecondaryNavigation/>
			</Navbar>
		);
	}
}


export default AdminNavbar;
