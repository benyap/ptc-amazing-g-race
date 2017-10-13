import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql, compose } from 'react-apollo';


@autobind
class ContactsTeam extends React.Component {
	render() {

		return (
			<div>
				<h5>Team contacts</h5>
				<table className='pt-table pt-striped' style={{marginBottom:'1rem'}}>
					<tbody>

					</tbody>
				</table>
			</div>
		);
	}
}


export default ContactsTeam;
