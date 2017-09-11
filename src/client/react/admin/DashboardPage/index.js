import React from 'react';
import { autobind } from 'core-decorators';
import Authenticated from '../../../../../lib/react/components/utility/Authenticated';


@autobind
class DashboardPage extends React.Component {
	render() {
		return (
			<div>
				<main id='admin-login'>
					<h1>Administrator Dashboard</h1>
				</main>
			</div>
		);
	}
}


export default DashboardPage;
