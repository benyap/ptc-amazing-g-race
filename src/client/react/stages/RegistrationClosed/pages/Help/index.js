import React from 'react';
import { connect } from 'react-redux';

import '../../../../scss/dashboard/_main.scss'
import '../../../../scss/dashboard/_help.scss';


const mapStateToProps = (state, ownProps) => {
	return { members: state.userInfo.teamMembers };
}

@connect(mapStateToProps)
class Help extends React.Component {
	render() {
		let memberContacts = null;
		if (this.props.members) {
			memberContacts = this.props.members.map((member) => {
				return (
					<tr key={member.username}>
						<td>{`${member.firstname} ${member.lastname}`}</td>
						<td><a href={`tel:${member.mobileNumber}`}>{member.mobileNumber}</a></td>
					</tr>
				);
			});
		}

		return (
			<main id='help' className='dashboard'>
				<div className='content'>
					<h2 style={{color: 'white'}}>
						Help
					</h2>
					<h5>Team contacts</h5>
					<table className='pt-table pt-striped contacts'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Mobile</th>
							</tr>
						</thead>
						<tbody>
							{ memberContacts }
						</tbody>
					</table>
				</div>
			</main>
		);
	}
}


export default Help;
